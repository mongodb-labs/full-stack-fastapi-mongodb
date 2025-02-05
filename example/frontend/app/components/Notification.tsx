"use client";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { first, removeNotice, timeoutNotice } from "../lib/slices/toastsSlice";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { RootState } from "../lib/store";
import { Transition } from "@headlessui/react";

const renderIcon = (iconName?: string) => {
  if (iconName === "success") {
    return (
      <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
    );
  } else if (iconName === "error") {
    return (
      <ExclamationCircleIcon
        className="h-6 w-6 text-red-500"
        aria-hidden="true"
      />
    );
  } else if (iconName === "information") {
    return (
      <InformationCircleIcon
        className="h-6 w-6 text-blue-500"
        aria-hidden="true"
      />
    );
  }
};

export default function Notification() {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();

  const firstNotification = useAppSelector((state: RootState) => first(state));

  useEffect(() => {
    async function push() {
      if (firstNotification) {
        setShow(true);
        await dispatch(timeoutNotice(firstNotification));
        setShow(false);
      }
    }

    push();
  });

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          className="w-full max-w-sm"
          show={show}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {show && (
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                {firstNotification && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {renderIcon(firstNotification.icon)}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        {firstNotification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {firstNotification.content}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShow(false)}
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Transition>
      </div>
    </div>
  );
}
