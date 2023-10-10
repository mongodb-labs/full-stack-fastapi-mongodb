import {
  IUserProfile,
  IUserProfileUpdate,
  IUserProfileCreate,
  IUserOpenProfileCreate,
  ITokenResponse,
  IWebToken,
  INewTOTP,
  IEnableTOTP,
  IMsg,
} from "../interfaces"
import { apiCore } from "./core"

export const apiAuth = {
  // TEST
  async getTestText() {
    const res = await fetch(`${apiCore.url}/users/tester`)
    return (await res.json()) as IMsg
  },
  // LOGIN WITH MAGIC LINK OR OAUTH2 (USERNAME/PASSWORD)
  async loginWithMagicLink(email: string) {
    const res = await fetch(`${apiCore.url}/login/magic/${email}`, {
      method: "POST",
    })
    return (await res.json()) as IWebToken
  },
  async validateMagicLink(token: string, data: IWebToken) {
    const res = await fetch(`${apiCore.url}/login/claim`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as ITokenResponse
  },
  async loginWithOauth(username: string, password: string) {
    // Version of this: https://github.com/unjs/ofetch/issues/37#issuecomment-1262226065
    // useFetch is borked, so you'll need to ignore errors https://github.com/unjs/ofetch/issues/37
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("password", password)
    const res = await fetch(`${apiCore.url}/login/oauth`, {
      method: "POST",
      body: params,
      // @ts-ignore
      headers: { "Content-Disposition": params },
    })
    return (await res.json()) as ITokenResponse
  },
  // TOTP SETUP AND AUTHENTICATION
  async loginWithTOTP(token: string, data: IWebToken) {
    const res = await fetch(`${apiCore.url}/login/totp`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as ITokenResponse
  },
  async requestNewTOTP(token: string) {
    const res = await fetch(`${apiCore.url}/users/new-totp`, {
      method: "POST",
      headers: apiCore.headers(token),
    })
    return (await res.json()) as INewTOTP
  },
  async enableTOTPAuthentication(token: string, data: IEnableTOTP) {
    const res = await fetch(`${apiCore.url}/login/totp`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  async disableTOTPAuthentication(token: string, data: IUserProfileUpdate) {
    const res = await fetch(`${apiCore.url}/login/totp`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  // MANAGE JWT TOKENS (REFRESH / REVOKE)
  async getRefreshedToken(token: string) {
    const res = await fetch(`${apiCore.url}/login/refresh`, {
      method: "POST",
      headers: apiCore.headers(token),
    })
    return (await res.json()) as ITokenResponse
  },
  async revokeRefreshedToken(token: string) {
    const res = await fetch(`${apiCore.url}/login/revoke`, {
      method: "POST",
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  // USER PROFILE MANAGEMENT
  async createProfile(data: IUserOpenProfileCreate) {
    const res = await fetch(`${apiCore.url}/users/`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return (await res.json()) as IUserProfile
  },
  async getProfile(token: string) {
    const res = await fetch(`${apiCore.url}/users/`, {
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IUserProfile
  },
  async updateProfile(token: string, data: IUserProfileUpdate) {
    const res = await fetch(`${apiCore.url}/users/`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IUserProfile
  },
  // ACCOUNT RECOVERY
  async recoverPassword(email: string) {
    const res = await fetch(`${apiCore.url}/login/recover/${email}`, {
      method: "POST",
    })
    return (await res.json()) as IMsg | IWebToken
  },
  async resetPassword(password: string, claim: string, token: string) {
    const res = await fetch(`${apiCore.url}/login/reset`, {
      method: "POST",
      body: JSON.stringify({
        new_password: password,
        claim,
      }),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  async requestValidationEmail(token: string) {
    const res = await fetch(`${apiCore.url}/users/send-validation-email`, {
      method: "POST",
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  async validateEmail(token: string, validation: string) {
    const res = await fetch(`${apiCore.url}/users/validate-email`, {
      method: "POST",
      body: JSON.stringify({ validation }),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  // ADMIN USER MANAGEMENT
  async getAllUsers(token: string) {
    const res = await fetch(`${apiCore.url}/users/all`, {
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IUserProfile[]
  },
  async toggleUserState(token: string, data: IUserProfileUpdate) {
    const res = await fetch(`${apiCore.url}/users/toggle-state`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    return (await res.json()) as IMsg
  },
  async createUserProfile(token: string, data: IUserProfileCreate) {
    console.log(`${apiCore.url}/users/create`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    const res = await fetch(`${apiCore.url}/users/create`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    })
    console.log(res.body)
    return (await res.json()) as IUserProfile
  },
}
