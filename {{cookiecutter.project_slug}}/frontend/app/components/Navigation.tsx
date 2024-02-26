"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AlertsButton from "./alerts/AlertsButton";
import dynamic from "next/dynamic";
const AuthenticationNavigation = dynamic(
  () => import("./authentication/AuthenticationNavigation"),
  { ssr: false },
);

const navigation = [
  { name: "About", to: "/about" },
  { name: "Authentication", to: "/authentication" },
  { name: "Blog", to: "/blog" },
];

const renderIcon = (open: boolean) => {
  if (!open) {
    return <Bars3Icon className="block h-6 w-6" aria-hidden="true" />;
  } else {
    return <XMarkIcon className="block h-6 w-6" aria-hidden="true" />;
  }
};

const renderNavLinks = (style: string) => {
  return navigation.map((nav) => (
    <Link href={nav.to} key={nav.name} className={style}>
      {nav.name}
    </Link>
  ));
};
export default function Navigation() {
  return (
    <header>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
                    <span className="sr-only">Open main menu</span>
                    {renderIcon(open)}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/" className="flex flex-shrink-0 items-center">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="https://tailwindui.com/img/logos/mark.svg?color=rose&shade=600"
                        alt="Your Company"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="https://tailwindui.com/img/logos/mark.svg?color=rose&shade=600"
                        alt="Your Company"
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {renderNavLinks(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-rose-500",
                    )}
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <AlertsButton />
                  <AuthenticationNavigation />
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-4">
                {renderNavLinks(
                  "block hover:border-l-4 hover:border-rose-500 hover:bg-rose-50 py-2 pl-3 pr-4 text-base font-medium text-rose-700",
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </header>
  );
}
