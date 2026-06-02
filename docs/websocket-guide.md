# Websockets for interactive communication

[Websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) permit synchronous interactive communication between a user's browser and a server. A series of messages are sent between each end, triggering response events.

While Websockets support multi-user sessions, this documentation is mainly focused on a single-user session.

---

1. [Getting started](getting-started.md)
2. [Development and installation](development-guide.md)
3. [Deployment for production](deployment-guide.md)
4. [Authentication and magic tokens](authentication-guide.md)
5. [Websockets for interactive communication](websocket-guide.md)

---
## Contents

- [Why Websockets?](#why-websockets)
- [High-level architecture and workflow](#high-level-architecture-and-workflow)
- [Requirements](#requirements)
- [Setting up the React `frontend`](#setting-up-the-react-frontend)
- [Setting up the FastAPI `backend`](#setting-up-the-fastapi-backend)

## Why Websockets?

Web applications sessions are not persistent. You can maintain state at the back- _or_ frontend, but not both simultaneously. It's great that `React Redux` allows your browser to store what you've been doing, but that will need to be communicated via your API to the backend on every page change.

There are ways around this, such as automatically polling the API (known as [long polling](https://ably.com/topic/long-polling)), but Websockets create a bidirectional session between the front- and backends, allowing you to run a synchronous interactive process.

This is great for interactive chat services, or where your app offers complex software which is impractical (or outright impossible) to run in a browser.

Depending on the popularity of your app, concurrency may become a problem. Stateless polling means you can have millions of users on relatively limited infrastructure, because they load information, and then read it. People are using your app simultaneously, not polling your infrastructure simultaneously. 

Websockets are active sessions, so be sparing with the amount of information you send back and forth.

## High-level architecture and workflow

The following general conditions apply:

- If a session requires user-authentication, then you need to manually perform this. You may be used to FastAPI routes handling this for you normally, but Websockets don't.
- Messages sent between front- and backend are `JSON-encoded`. If you use variables that aren't easily stringified (Pydantic, for example, doesn't automatically stringify UUIDs), you'll need to deliberately check for this.

Here's how the workflow tends to play out:

- `frontend` - initialize a socket by opening a session and sending an initial payload `request`, which may include a user token (if authentication is required).
- `backend` - receive a socket `request`, validate the session (user or other), send a `response` to the `frontend`, and then enter a `while True` loop to keep the session open and keep listening for `requests`. 
- `frontend` - each `response` triggers an event, updating the view.
- `frontend` - send an instruction to close the socket when the user ends the sessions or, as fallback, when the user changes the page.
- `backend` - can also end the session based on user activity.

If the user is joining a multi-user session, then each update to the session is communicated to all users.

## Requirements

- [FastAPI](https://fastapi.tiangolo.com/advanced/websockets/) requires the installation of the WebSockets library:

```
pip install websockets
```

- The frontend uses the browser's native [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) — no additional packages required.

## Setting up the React `frontend`

The WebSocket backend is reached by converting your `NEXT_PUBLIC_API_URL` from `http` to `ws` (or `https` to `wss` in production). The connection is managed in a `useRef` so it persists across renders without triggering re-renders.

In the relevant `page.tsx` (or component):

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { token, refreshTokens } from "../lib/slices/tokensSlice";
import { addNotice } from "../lib/slices/toastsSlice";
import { RootState } from "../lib/store";

interface ISocketResponse {
  state: string;
  data: Record<string, unknown>;
  error?: string;
}

interface ISocketRequest {
  state: string;
  data: Record<string, unknown>;
}

export default function SocketPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: RootState) => token(state));
  const wsRef = useRef<WebSocket | null>(null);
  const [streaming, setStreaming] = useState(false);

  function sendSocketRequest(state: string, data: Record<string, unknown>) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload: ISocketRequest = { state, data };
      wsRef.current.send(JSON.stringify(payload));
    }
  }

  function watchRequestSocket(request: ISocketRequest) {
    switch (request.state) {
      case "something":
        // Request-specific options
        break;
      default:
        sendSocketRequest(request.state, request.data);
    }
  }

  function watchResponseSocket(response: ISocketResponse) {
    // response: { state, data, error }
    switch (response.state) {
      case "initialised":
        // User session is authenticated and you can now launch the process
        watchRequestSocket({ state: "startThings", data: {} });
        break;
      case "somethingHappened":
        // Do stuff
        break;
      case "somethingElse":
        // Do some other stuff
        break;
      case "error":
        dispatch(
          addNotice({
            title: "Some error",
            content: `Error: ${response.error}`,
            icon: "error",
          }),
        );
        break;
    }
  }

  useEffect(() => {
    async function initialiseSocket() {
      await dispatch(refreshTokens());
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
      const wsUrl = apiUrl.replace(/^http/, "ws");
      const ws = new WebSocket(`${wsUrl}/socket`);
      wsRef.current = ws;

      ws.onopen = () => {
        // Deliberately sending a user token to authenticate the session
        ws.send(JSON.stringify({ token: accessToken }));
        setStreaming(true);
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data as string) as ISocketResponse;
        watchResponseSocket(response);
      };

      ws.onerror = () => {
        dispatch(
          addNotice({
            title: "Connection error",
            content: "WebSocket connection failed.",
            icon: "error",
          }),
        );
      };
    }

    initialiseSocket();

    // Close the socket when the component unmounts or the user navigates away
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        setStreaming(false);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div>{/* page content */}</div>;
}
```
```

The `response` is a `switch` statement which identifies and responds to the appropriate event. 

## Setting up the FastAPI `backend`

At the `backend` you already have a [sockets.py](https://github.com/mongodb-labs/full-stack-fastapi-mongodb/blob/0.8.2/%7B%7Bcookiecutter.project_slug%7D%7D/backend/app/app/api/sockets.py) which handles serialising and deserialising the Websocket requests and responses. Now you create a route in `/endpoints`:

```
from fastapi import APIRouter, Depends, WebSocket, HTTPException, WebSocketException
from starlette.websockets import WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError
from app import crud, models, schema_types, schemas
from app.api import deps, sockets

router = APIRouter()

@router.websocket("/socket")
async def some_websocket_session(*, db: Session = Depends(deps.get_db), websocket: WebSocket):
    current_user = None
    initialised = False
    success = False
    # 1. Open the socket and validate current user
    await websocket.accept()
    request = await sockets.receive_request(websocket=websocket)
    response = {"state": "error", "error": "Could not validate credentials."}
    if request.get("token"):
        try:
            current_user = deps.get_active_websocket_user(db=db, token=request["token"])
            response = {"state": "initialised", "data": {}}
        except ValidationError:
            pass
    success = await sockets.send_response(websocket=websocket, response=response)
    if response["state"] == "initialised" and success:
        try:
            while True and success:
                # LOOP #################################################################
                request = await sockets.receive_request(websocket=websocket)
                if not request:
                    break
                state = request.get("state")
                data = request.get("data", {})
                data = sockets.sanitize_data_request(data)
                response = {"state": state}
                try:
                    # ALL THE STATES ###################################################
                    if state == "startThings":
                        # Do some stuff
                        data = {"something": "yes, something"}
                        response["data"] = data
                        initialised = True
                    # SAVE AND CLOSE THE SESSION #######################################
                    if state == "save" and initialised:
                        # This will close the socket, if it succeeds
                        response["data"] = {}
                        break
                except ValidationError as e:
                    response = {"state": "error", "error": e}
                success = await sockets.send_response(websocket=websocket, response=response)
                # LOOP #################################################################
        except (WebSocketDisconnect, WebSocketException, ConnectionClosedError) as e:
            response = {"state": "error", "error": e}
    try:
        await sockets.send_response(websocket=websocket, response=response)
        await websocket.close(code=1000)
    except (WebSocketDisconnect, ConnectionClosedError, RuntimeError, WebSocketException):
        pass
```

And that's - very simplistically - basically it.