"use client";

import { IUserProfileUpdate } from "../../lib/interfaces";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { useForm } from "react-hook-form";
import { profile, updateUserProfile } from "../../lib/slices/authSlice";
import { useEffect, useState } from "react";
import { RootState } from "../../lib/store";

const title = "Personal settings";
const description =
  "Changing your email address will change your login. Any changes will require you to enter your original password.";

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
    default:
      return <></>;
  }
};

export default function Profile() {
  const [updatedProfile, setState] = useState({} as IUserProfileUpdate);

  const dispatch = useAppDispatch();
  const currentProfile = useAppSelector((state: RootState) => profile(state));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const schema = {
    original: {
      required: currentProfile.password,
      minLength: 8,
      maxLength: 64,
    },
    fullName: { required: false },
    email: { required: true },
  };

  const resetProfile = () => {
    setState({
      fullName: currentProfile.fullName,
      email: currentProfile.email,
    });
  };

  useEffect(() => {
    resetProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(values: any) {
    let newProfile = {} as IUserProfileUpdate;
    if (
      (!currentProfile.password && !values.original) ||
      (currentProfile.password && values.original)
    ) {
      if (values.original) newProfile.original = values.original;
      if (values.email) {
        newProfile.email = values.email;
        if (values.fullName) newProfile.fullName = values.fullName;
        await dispatch(updateUserProfile(newProfile));
        resetProfile();
      }
    }
  }

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md max-w-lg">
      <form onSubmit={handleSubmit(submit)} validation-schema="schema">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="original"
              className="block text-sm font-medium text-gray-700"
            >
              Original password
            </label>
            <div className="mt-1 group relative inline-block w-full">
              <input
                {...register("original", schema.original)}
                id="original"
                name="original"
                type="password"
                autoComplete="password"
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
              />
              {errors.original && renderError(errors.original.type)}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Your name
            </label>
            <div className="mt-1 group relative inline-block w-full">
              <input
                {...register("fullName", schema.fullName)}
                id="fullName"
                name="fullName"
                type="string"
                onChange={(e) => setState({ fullName: e.target.value })}
                placeholder={updatedProfile.fullName}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
              />
              {errors.fullName && renderError(errors.fullName.type)}
            </div>
          </div>

          <div className="space-y-1">
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
                onChange={(e) => setState({ email: e.target.value })}
                placeholder={updatedProfile.email}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-rose-600 focus:outline-none focus:ring-rose-600 sm:text-sm"
              />
              {errors.email && renderError(errors.email.type)}
            </div>
          </div>
        </div>
        <div className="py-3 pb-6 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-rose-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
