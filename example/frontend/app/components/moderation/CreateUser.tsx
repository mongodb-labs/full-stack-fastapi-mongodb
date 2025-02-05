"use client";

import { apiAuth } from "../../lib/api";
import { generateUUID } from "../../lib/utilities";
import { IUserProfileCreate } from "../../lib/interfaces";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { refreshTokens, token } from "../../lib/slices/tokensSlice";
import { RootState } from "../../lib/store";
import { addNotice } from "../../lib/slices/toastsSlice";

export default function CreateUser() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: RootState) => token(state));
  const state = useAppSelector((state: RootState) => state);

  const { register, handleSubmit } = useForm();

  // @ts-ignore
  async function submit(values: any) {
    if (values.email) {
      await dispatch(refreshTokens());
      const data: IUserProfileCreate = {
        email: values.email,
        password: generateUUID(),
        fullName: values.fullName ? values.fullName : "",
      };
      try {
        const res = await apiAuth.createUserProfile(accessToken, data);
        if (!res.id) throw "Error";
        dispatch(
          addNotice({
            title: "User created",
            content:
              "An email has been sent to the user with their new login details.",
          }),
        );
      } catch {
        dispatch(
          addNotice({
            title: "Update error",
            content: "Invalid request.",
            icon: "error",
          }),
        );
      }
    }
  }

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md min-w-max">
      <form onSubmit={handleSubmit(submit)} validation-schema="schema">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Profile name
            </label>
            <div className="mt-1 group relative inline-block w-full">
              <input
                {...register("fullName")}
                id="fullName"
                name="fullName"
                type="string"
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1 group relative inline-block w-full">
              <input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="py-3 pb-6 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-rose-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
