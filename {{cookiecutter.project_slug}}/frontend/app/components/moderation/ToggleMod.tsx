"use client";

import { apiAuth } from "../../lib/api";
import { IUserProfileUpdate } from "../../lib/interfaces";
import CheckToggle from "./CheckToggle";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { RootState } from "../../lib/store";
import { useState } from "react";
import { refreshTokens, token } from "../../lib/slices/tokensSlice";
import { addNotice } from "../../lib/slices/toastsSlice";

interface ToggleModProps {
  email: string;
  check: boolean;
}

export default function ToggleMod(props: ToggleModProps) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: RootState) => token(state));

  const [enabled, setEnabled] = useState(props.check);

  async function submit() {
    await dispatch(refreshTokens());
    const data: IUserProfileUpdate = {
      email: props.email,
      is_superuser: !props.check,
    };
    try {
      const res = await apiAuth.toggleUserState(accessToken, data);
      if (!res.msg) throw res;
    } catch (results) {
      dispatch(
        addNotice({
          title: "Update error",
          //@ts-ignore
          content: results?.msg ?? "Invalid request.",
          icon: "error",
        }),
      );
      setEnabled(props.check);
    }
  }

  return <CheckToggle check={enabled} onClick={submit} />;
}
