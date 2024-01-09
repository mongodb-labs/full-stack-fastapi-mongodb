"use client";

import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "../../lib/hooks";
import { sendEmailValidation } from "../../lib/slices/authSlice";

export default function ValidateEmailButton() {
  const dispatch = useAppDispatch();

  async function submit() {
    await dispatch(sendEmailValidation());
  }

  return (
    <button
      type="submit"
      className="text-gray-900 hover:text-gray-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium"
      onClick={() => submit()}
    >
      <AtSymbolIcon
        className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
        aria-hidden="true"
      />
      <span className="truncate">Validate email</span>
    </button>
  );
}
