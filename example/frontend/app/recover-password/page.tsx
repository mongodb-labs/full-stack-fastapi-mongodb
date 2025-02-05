"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { useForm } from "react-hook-form";
import { loggedIn, recoverPassword } from "../lib/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "../lib/store";

const redirectRoute = "/";
const schema = {
  email: { required: true },
};

export default function RecoverPassword() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state: RootState) => loggedIn(state));

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function submit(values: any) {
    await dispatch(recoverPassword(values.email));
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    router.push(redirectRoute);
  }

  useEffect(() => {
    if (isLoggedIn) router.push(redirectRoute);
  });

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
              Recover your account
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
                      <div
                        id="email"
                        className="absolute left-5 top-5 translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:bottom-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-gray-700"
                      >
                        This field is required.
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-right">
                    <Link
                      href="/login"
                      className="font-medium text-rose-500 hover:text-rose-600"
                    >
                      Login to your account
                    </Link>
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
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1561487138-99ccf59b135c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
            alt=""
          />
        </div>
      </div>
    </main>
  );
}
