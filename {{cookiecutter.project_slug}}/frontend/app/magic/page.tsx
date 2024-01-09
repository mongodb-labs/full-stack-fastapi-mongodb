"use client";

import { LinkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { tokenParser } from "../lib/utilities";
import { token } from "../lib/slices/tokensSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Link from "next/link";
import { RootState } from "../lib/store";
import { useRouter } from "next/navigation";
import { loggedIn, logout } from "../lib/slices/authSlice";

const redirectRoute = "/login";

export default function Magic() {
  const router = useRouter();
  const accessToken = useAppSelector((state: RootState) => token(state));
  const isLoggedIn = useAppSelector((state: RootState) => loggedIn(state));
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function checkCredentials(): Promise<void> {
      if (isLoggedIn) {
        router.push("/");
      }
      if (
        !(accessToken && tokenParser(accessToken).hasOwnProperty("fingerprint"))
      ) {
        router.push(redirectRoute);
      }
    }
    checkCredentials();
  }, [accessToken, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFingerprint = async () => {
    await dispatch(logout());
  };

  return (
    <main className="flex min-h-full">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <EnvelopeIcon
              className="text-rose-500 h-12 w-12"
              aria-hidden="true"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Check your email
            </h2>
            <p className="text-sm font-medium text-rose-500 hover:text-rose-600 mt-6">
              We sent you an email with a magic link. Once you click that (or
              copy it into this browser) you&apos;ll be signed in.
            </p>
            <p className="text-sm font-medium text-rose-500 hover:text-rose-600 mt-2">
              Make sure you use the same browser you requested the login from or
              it won&apos;t work.
            </p>
          </div>

          <Link
            href="/login?oauth=true"
            className="mt-8 flex"
            onClick={removeFingerprint}
          >
            <LinkIcon
              className="text-rose-500 h-4 w-4 mr-1"
              aria-hidden="true"
            />
            <p className="text-sm text-rose-500 align-middle">
              If you prefer, use your password & don&apos;t email.
            </p>
          </Link>
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
