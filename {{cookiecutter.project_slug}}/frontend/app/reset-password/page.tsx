"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch } from "../lib/hooks"
import { useForm } from "react-hook-form"
import { resetPassword } from "../lib/slices/authSlice"
import { Suspense, useEffect } from "react"
import Image from "next/image"

const schema = {
  password: { required: true, minLength: 8, maxLength: 64 },
  confirmation: { required: true },
};

const redirectRoute = "/login";

//@ts-ignore
const renderError = (type: LiteralUnion<keyof RegisterOptions, string>) => {
  const style =
    "absolute left-5 top-5 translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-700";
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
    case "match":
      return <div className={style}>Your passwords do not match.</div>;
    default:
      return <></>;
  }
};

function UnsuspendedResetPassword() {
  const dispatch = useAppDispatch()

  const router = useRouter();
  const query = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function submit(values: any) {
    await dispatch(
      resetPassword(values.password, query.get("token") as string),
    );
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });

    router.push(redirectRoute);
  }

  useEffect(() => {
    if (!query || !query.get("token")) router.push("/");
  }); // eslint-disable-line react-hooks/exhaustive-deps

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
              Reset your password
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form
                onSubmit={handleSubmit(submit)}
                validation-schema="schema"
                className="space-y-6"
              >
                <div>
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
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Repeat password
                  </label>
                  <div className="mt-1 group relative inline-block w-full">
                    <input
                      {...register("confirmation", {
                        ...schema.confirmation,
                        validate: {
                          match: (val) => watch("password") == val,
                        },
                      })}
                      id="confirmation"
                      name="confirmation"
                      type="password"
                      autoComplete="confirmation"
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
                    />
                    {errors.confirmation &&
                      renderError(errors.confirmation.type)}
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

export default function ResetPassword() {
  return <Suspense><UnsuspendedResetPassword /></Suspense>
}