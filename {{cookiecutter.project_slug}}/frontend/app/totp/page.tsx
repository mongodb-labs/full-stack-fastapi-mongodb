"use client";

import { LinkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loggedIn, logout, totpLogin } from "../lib/slices/authSlice";
import { tokenIsTOTP } from "../lib/utilities";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";
import { RootState } from "../lib/store";

const totpSchema = {
  claim: { required: true },
};

const redirectAfterLogin = "/";
const loginPage = "/login";

export default function Totp() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(
    (state: RootState) => state.tokens.access_token,
  );
  const isLoggedIn = useAppSelector((state: RootState) => loggedIn(state));

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function submit(values: FieldValues) {
    await dispatch(totpLogin({ claim: values.claim }));
  }

  const removeFingerprint = async () => await dispatch(logout());

  useEffect(() => {
    if (isLoggedIn) router.push(redirectAfterLogin);
    // if there is no access token, nor is it totp, send the user back to login
    if (!(accessToken && tokenIsTOTP(accessToken))) router.push(loginPage);
  }, [isLoggedIn, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex min-h-full">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=rose&shade=500"
              alt="Your Company"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Two-factor authentication
            </h2>
            <p className="text-sm font-medium text-rose-500 hover:text-rose-600 mt-6">
              Enter the 6-digit verification code from your app.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit(submit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="claim"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Verification code
                  </label>
                  <div className="mt-1 group relative inline-block w-full">
                    <input
                      {...register("claim", totpSchema.claim)}
                      id="claim"
                      name="claim"
                      type="text"
                      autoComplete="off"
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
                    />
                    {errors.claim && (
                      <div className="absolute left-5 top-5 translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-700">
                        This field is required.
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-rose-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Link
          href="/login?oauth=true"
          className="mt-8 flex"
          onClick={removeFingerprint}
        >
          <LinkIcon className="text-rose-500 h-4 w-4 mr-1" aria-hidden="true" />
          <p className="text-sm text-rose-500 align-middle">
            Log in another way.
          </p>
        </Link>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1561487138-99ccf59b135c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
          alt=""
        />
      </div>
    </main>
  );
}
