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
  IErrorResponse,
} from "../interfaces";
import { apiCore } from "./core";

const jsonify = async (response: Response) => {
  if (response.ok) {
    return await response.json();
  } else {
    throw {
      message: `Request failed with ${response.status}: ${response.statusText}`,
      code: response.status,
    } as IErrorResponse;
  }
};

export const apiAuth = {
  // LOGIN WITH MAGIC LINK OR OAUTH2 (USERNAME/PASSWORD)
  async loginWithMagicLink(email: string): Promise<IWebToken> {
    const res = await fetch(`${apiCore.url}/login/magic/${email}`, {
      method: "POST",
    });
    return (await jsonify(res)) as IWebToken;
  },
  async validateMagicLink(
    token: string,
    data: IWebToken,
  ): Promise<ITokenResponse> {
    const res = await fetch(`${apiCore.url}/login/claim`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as ITokenResponse;
  },
  async loginWithOauth(
    username: string,
    password: string,
  ): Promise<ITokenResponse> {
    // Version of this: https://github.com/unjs/ofetch/issues/37#issuecomment-1262226065
    // useFetch is borked, so you'll need to ignore errors https://github.com/unjs/ofetch/issues/37
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    const res = await fetch(`${apiCore.url}/login/oauth`, {
      method: "POST",
      body: params,
      // @ts-ignore
      headers: { "Content-Disposition": params },
    });
    return (await jsonify(res)) as ITokenResponse;
  },
  // TOTP SETUP AND AUTHENTICATION
  async loginWithTOTP(token: string, data: IWebToken): Promise<ITokenResponse> {
    const res = await fetch(`${apiCore.url}/login/totp`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as ITokenResponse;
  },
  async requestNewTOTP(token: string): Promise<INewTOTP> {
    const res = await fetch(`${apiCore.url}/users/new-totp`, {
      method: "POST",
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as INewTOTP;
  },
  async enableTOTPAuthentication(
    token: string,
    data: IEnableTOTP,
  ): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/login/totp`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  async disableTOTPAuthentication(
    token: string,
    data: IUserProfileUpdate,
  ): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/login/totp`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  // MANAGE JWT TOKENS (REFRESH / REVOKE)
  async getRefreshedToken(token: string): Promise<ITokenResponse> {
    const res = await fetch(`${apiCore.url}/login/refresh`, {
      method: "POST",
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as ITokenResponse;
  },
  async revokeRefreshedToken(token: string): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/login/revoke`, {
      method: "POST",
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  // USER PROFILE MANAGEMENT
  async createProfile(data: IUserOpenProfileCreate): Promise<IUserProfile> {
    const res = await fetch(`${apiCore.url}/users/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return (await jsonify(res)) as IUserProfile;
  },
  async getProfile(token: string): Promise<IUserProfile> {
    const res = await fetch(`${apiCore.url}/users/`, {
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IUserProfile;
  },
  async updateProfile(
    token: string,
    data: IUserProfileUpdate,
  ): Promise<IUserProfile> {
    const res = await fetch(`${apiCore.url}/users/`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IUserProfile;
  },
  // ACCOUNT RECOVERY
  async recoverPassword(email: string): Promise<IMsg | IWebToken> {
    const res = await fetch(`${apiCore.url}/login/recover/${email}`, {
      method: "POST",
    });
    return (await jsonify(res)) as IMsg | IWebToken;
  },
  async resetPassword(
    password: string,
    claim: string,
    token: string,
  ): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/login/reset`, {
      method: "POST",
      body: JSON.stringify({
        new_password: password,
        claim,
      }),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  async requestValidationEmail(token: string): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/users/send-validation-email`, {
      method: "POST",
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  async validateEmail(token: string, validation: string): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/users/validate-email`, {
      method: "POST",
      body: JSON.stringify({ validation }),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  // ADMIN USER MANAGEMENT
  async getAllUsers(token: string): Promise<IUserProfile[]> {
    const res = await fetch(`${apiCore.url}/users/all`, {
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IUserProfile[];
  },
  async toggleUserState(
    token: string,
    data: IUserProfileUpdate,
  ): Promise<IMsg> {
    const res = await fetch(`${apiCore.url}/users/toggle-state`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IMsg;
  },
  async createUserProfile(
    token: string,
    data: IUserProfileCreate,
  ): Promise<IUserProfile> {
    const res = await fetch(`${apiCore.url}/users/create`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: apiCore.headers(token),
    });
    return (await jsonify(res)) as IUserProfile;
  },
};
