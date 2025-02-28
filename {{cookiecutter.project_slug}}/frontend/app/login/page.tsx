"use client"

import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { login, loggedIn } from "../lib/slices/authSlice"
import { useRouter, useSearchParams } from "next/navigation"
import { tokenIsTOTP, tokenParser } from "../lib/utilities"
import { Switch } from "@headlessui/react"
import { Suspense, useEffect, useState } from "react"
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import Link from "next/link";

const schema = {
  email: { required: true },
  password: { required: true, minLength: 8, maxLength: 64 },
};

//@ts-ignore
const renderError = (type: LiteralUnion<keyof RegisterOptions, string>) => {
  const style =
    "absolute left-5 top-0 translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-700";
  switch (type) {
    case "required":
      return <div className={style}>This field is required.</div>;
    case "minLength":
    case "maxLength":
      return (
        <div className={style}>
          Your password must be between 8 and 64 characters long.
        </div>
      );
    default:
      return <></>;
  }
};
const redirectAfterLogin = "/";
const redirectAfterMagic = "/magic";
const redirectTOTP = "/totp";

function PasswordBlock(
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors<FieldValues>,
  oauth: boolean,
) {
  if (oauth) {
    return (
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 group relative inline-block w-full">
          <input
            {...register("password", schema.password)}
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
          />
          {errors.password && renderError(errors.password.type)}
        </div>
        <div className="text-sm text-right">
          <Link
            href="/recover-password"
            className="font-medium text-rose-500 hover:text-rose-600"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    );
  } else {
    return;
  }
}

function LoginMessage(oauth: boolean) {
  if (oauth)
    return (
      <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        Login with password
      </h2>
    );
  else
    return (
      <div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Login with email
        </h2>
        <p className="text-sm font-medium text-rose-500 hover:text-rose-600 mt-6">
          We&apos;ll check if you have an account, and create one if you
          don&apos;t.
        </p>
      </div>
    );
}

function UnsuspendedPage() {
  const [oauth, setOauth] = useState(false)
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.tokens.access_token)
  const isLoggedIn = useAppSelector((state) => loggedIn(state))
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = (route: string) => {
    router.push(route);
  };

  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  async function submit(data: FieldValues) {
    await dispatch(
      login({ username: data["email"], password: data["password"] }),
    );
  }

  const toggleOauth = (e: any) => {
    // If previous state enabled oauth, unregister password valdiation
    if (oauth) unregister("password");
    setOauth(e);
  };

  useEffect(() => {
    if (searchParams && searchParams.get("oauth")) setOauth(true);
  }, [searchParams]);

  useEffect(() => {
    if (isLoggedIn) return redirectTo(redirectAfterLogin);
    if (
      accessToken &&
      tokenIsTOTP(accessToken) &&
      (!oauth || isSubmitSuccessful)
    )
      return redirectTo(redirectTOTP);
    if (
      accessToken &&
      tokenParser(accessToken).hasOwnProperty("fingerprint") &&
      !oauth
    )
      return redirectTo(redirectAfterMagic);
  }, [isLoggedIn, accessToken, isSubmitSuccessful]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {LoginMessage(oauth)}
          </div>

          <div className="mt-6">
            <form
              onSubmit={handleSubmit(submit)}
              validation-schema="schema"
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 group relative inline-block w-full">
                  <input
                    {...register("email", schema.email)}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
                  />
                  {errors.email && (
                    <div className="absolute left-5 top-5 translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-700">
                      This field is required.
                    </div>
                  )}
                </div>
              </div>

              {PasswordBlock(register, errors, oauth)}

              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-rose-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-rose-500 align-middle">
              If you prefer, use your password & don&apos;t email.
            </p>
            <Switch
              checked={oauth}
              onChange={toggleOauth}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md bg-white"
              />
              <span
                aria-hidden="true"
                className={[
                  oauth ? "bg-rose-500" : "bg-gray-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out",
                ].join(" ")}
              />
              <span
                aria-hidden="true"
                className={[
                  oauth ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
                ].join(" ")}
              />
            </Switch>
          </div>
        </div>
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

export default function Page() {
  return <Suspense><UnsuspendedPage /></Suspense>
}