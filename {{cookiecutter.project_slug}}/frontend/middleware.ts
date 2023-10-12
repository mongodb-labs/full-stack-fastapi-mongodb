import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUserProfile, isAdmin, loggedIn } from "./app/lib/slices/authSlice"
import { store } from "./app/lib/store"
import { refreshTokens } from "./app/lib/slices/tokensSlice"

const redirectRoutes = [
  "/login",
  "/join",
  "/recover-password",
  "/reset-password",
]
const anonymousRoutes = [
  "/login",
  "/recover-password",
  "/reset-password",
  "/magic",
  "/totp",
]
const authenticatedRoutes = ["/settings"]
const adminRoutes = ["/moderation"]
const refreshRoutes = ["/"]

async function refresh() {
  await store.dispatch(refreshTokens())
  await store.dispatch(getUserProfile(store.getState().tokens.access_token))
}

export function middleware(request: NextRequest) {
  const from = request.headers.has("referer") ? request.headers.get("referer") : "/"
  const to = request.url
  const state = store.getState()
  if (from) {
      if (loggedIn(state) && anonymousRoutes.some(route => to.endsWith(route))) {
          if (redirectRoutes.some(route => from.endsWith(route))) {
              return NextResponse.redirect(new URL('/', request.url))
          } else {
              return NextResponse.redirect(new URL(from, request.url))
          }
      } else if (!loggedIn(state) && authenticatedRoutes.some(route => to.endsWith(route))) {
          if (redirectRoutes.some(route => from.endsWith(route))) {
              return NextResponse.redirect(new URL('/', request.url))
          } else {
              return NextResponse.redirect(new URL(from, request.url))
          }
      } else if (!isAdmin(state) && adminRoutes.some(route => to.endsWith(route))) {
          return NextResponse.redirect(new URL(from, request.url))
      }
  }
  if (!loggedIn(state) && refreshRoutes.some(route => to.endsWith(route))) {
      refresh()
  }
}
