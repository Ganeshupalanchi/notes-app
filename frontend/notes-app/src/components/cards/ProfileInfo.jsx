import React from "react";
import { getInitials } from "../../utils/helper";

export default function ProfileInfo({ onLogout, userInfo }) {
  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-950">
          {getInitials(userInfo.fullName)}
        </div>
        <div className="">
          <p className="text-sm font-medium">{userInfo.fullName}</p>
          <button
            className="text-sm text-slate-700 underline"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
}
