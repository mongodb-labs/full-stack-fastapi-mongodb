"use client";

import { apiAuth } from "../../lib/api";
import { IUserProfile } from "../../lib/interfaces";
import CheckState from "./CheckState";
import ToggleActive from "./ToggleActive";
import ToggleMod from "./ToggleMod";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { RootState } from "../../lib/store";
import { useEffect, useState } from "react";
import { refreshTokens, token } from "../../lib/slices/tokensSlice";
import { addNotice } from "../../lib/slices/toastsSlice";

const renderUserProfiles = (userProfiles: IUserProfile[]) => {
  return userProfiles.map((profile) => (
    <tr key={profile.id}>
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
        {profile.fullName}
        <dl className="font-normal lg:hidden">
          <dt className="sr-only">Email</dt>
          <dd className="mt-1 truncate text-gray-700">{profile.email}</dd>
          <dt className="sr-only sm:hidden">Validated</dt>
          <dd className="mt-1 truncate sm:hidden">
            <CheckState check={profile.email_validated} />
          </dd>
        </dl>
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
        {profile.email}
      </td>
      <td className="hidden px-3 py-4 text-sm lg:table-cell">
        <CheckState check={profile.email_validated} />
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        <ToggleActive check={profile.is_active} email={profile.email} />
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        <ToggleMod check={profile.is_superuser} email={profile.email} />
      </td>
    </tr>
  ));
};

export default function UserTable() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: RootState) => token(state));

  const [userProfiles, setUserProfiles] = useState([] as IUserProfile[]);

  async function getAllUsers() {
    await dispatch(refreshTokens());
    try {
      const res = await apiAuth.getAllUsers(accessToken);
      if (res && res.length) setUserProfiles(res);
    } catch {
      dispatch(
        addNotice({
          title: "User Fetch Issue",
          content:
            "Failed to fetch all users, please check logged in permissions",
          icon: "error",
        }),
      );
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      await getAllUsers();
    }

    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md min-w-max">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Name
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Email
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Validated
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Active
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Moderator
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {renderUserProfiles(userProfiles)}
        </tbody>
      </table>
    </div>
  );
}
