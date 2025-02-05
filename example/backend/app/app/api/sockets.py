from __future__ import annotations
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError


async def send_response(*, websocket: WebSocket, response: dict):
    try:
        await websocket.send_json(response)
        return True
    except (WebSocketDisconnect, ConnectionClosedError):
        return False


async def receive_request(*, websocket: WebSocket) -> dict:
    try:
        return await websocket.receive_json()
    except (WebSocketDisconnect, ConnectionClosedError):
        return {}


def sanitize_data_request(data: any) -> any:
    # Putting here for want of a better place
    if isinstance(data, (list, tuple, set)):
        return type(data)(sanitize_data_request(x) for x in data if x or isinstance(x, bool))
    elif isinstance(data, dict):
        return type(data)(
            (sanitize_data_request(k), sanitize_data_request(v))
            for k, v in data.items()
            if k and v or isinstance(v, bool)
        )
    else:
        return data
