"use client";

import {
  Cog8ToothIcon,
  UsersIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UserTable from "../components/moderation/UserTable";
import CreateUser from "../components/moderation/CreateUser";
import { useAppSelector } from "../lib/hooks";
import { isAdmin } from "../lib/slices/authSlice";

const navigation = [
  { name: "Users", id: "USERS", icon: UsersIcon },
  { name: "Create", id: "CREATE", icon: UserPlusIcon },
];

export default function Moderation() {
  const [selected, changeSelection] = useState("USERS");
  const isValidAdmin = useAppSelector((state) => isAdmin(state));

  const router = useRouter();

  const redirectTo = (route: string) => {
    router.push(route);
  };

  const renderNavigation = () => {
    return navigation.map((item) => (
      <button
        key={`settings-${item.id}`}
        className={[
          item.id === selected
            ? "text-rose-700 hover:text-rose-700"
            : "text-gray-900 hover:text-gray-900",
          "group rounded-md px-3 py-2 flex items-center text-sm font-medium",
        ].join(" ")}
        onClick={() => changeSelection(item.id)}
      >
        <item.icon
          className={[
            item.id === selected
              ? "text-rose-700 hover:text-rose-700"
              : "text-gray-900 hover:text-gray-900",
            "flex-shrink-0 -ml-1 mr-3 h-6 w-6",
          ].join(" ")}
          aria-hidden="true"
        />
        <span className="truncate">{item.name}</span>
      </button>
    ));
  };

  useEffect(() => {
    async function checkAdmin() {
      if (!isValidAdmin) redirectTo("/settings");
    }
    checkAdmin();
  }, [isValidAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex min-h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="p-5">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1" aria-label="tabs">
              <div className="divide-y divide-solid">
                <button
                  className="text-gray-900 hover:text-gray-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium cursor-pointer"
                  onClick={() => redirectTo("/settings")}
                >
                  <Cog8ToothIcon
                    className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    aria-hidden="true"
                  />
                  <span className="truncate">Settings</span>
                </button>
                <div></div>
              </div>
              {renderNavigation()}
            </nav>
          </aside>
          <div className="space-y-6 ml-3 sm:px-6 lg:col-span-9 min-w-full lg:px-0">
            {selected === "USERS" && <UserTable />}
            {selected === "CREATE" && <CreateUser />}
          </div>
        </div>
      </div>
    </main>
  );
}
