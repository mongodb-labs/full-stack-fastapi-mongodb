"use client";

import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import type { RootState } from "../../lib/store";
import { Menu, Transition } from "@headlessui/react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { loggedIn, logout } from "../../lib/slices/authSlice";
import { useRouter } from "next/navigation";

const navigation = [{ name: "Settings", to: "/settings" }];
const redirectRoute = "/";

const renderNavLinks = () => {
  return navigation.map((nav) => (
    <Menu.Item key={nav.name}>
      {({ active }) => (
        <Link
          href={nav.to}
          key={nav.name}
          className={[
            active ? "bg-gray-100 cursor-pointer" : "",
            "block px-4 py-2 text-sm text-gray-700 cursor-pointer",
          ].join(" ")}
        >
          {nav.name}
        </Link>
      )}
    </Menu.Item>
  ));
};

const renderUser = (loggedIn: boolean) => {
  if (!loggedIn) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
      >
        <ArrowLeftOnRectangleIcon className="block h-6 w-6" />
      </Link>
    );
  } else {
    return (
      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </Menu.Button>
    );
  }
};

export default function AuthenticationNavigation() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state: RootState) => loggedIn(state));
  const router = useRouter();

  const logoutUser = () => {
    dispatch(logout());
    router.push(redirectRoute);
  };

  return (
    <Menu as="div" className="z-10 relative ml-3">
      {renderUser(isLoggedIn)}
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {renderNavLinks()}
          <Menu.Item>
            {({ active }) => (
              <a
                className={[
                  active ? "bg-gray-100 cursor-pointer" : "",
                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer",
                ].join(" ")}
                onClick={() => logoutUser()}
              >
                Logout
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
