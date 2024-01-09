import { ISendEmail, IMsg } from "../interfaces";
import { apiCore } from "./core";

export const apiService = {
  // USER CONTACT MESSAGE
  async postEmailContact(data: ISendEmail) {
    const res = await fetch(`${apiCore.url}/service/contact`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return (await res.json()) as IMsg;
  },
};
