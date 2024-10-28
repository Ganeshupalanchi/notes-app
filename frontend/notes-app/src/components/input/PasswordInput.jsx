import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter Password",
}) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="mb-3 flex items-center rounded border-[1.5px] bg-transparent px-5">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mr-3 w-full rounded bg-transparent py-3 text-sm outline-none"
      />

      {isShowPassword ? (
        <FaRegEye
          size={23}
          className="cursor-pointer text-primary"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={23}
          className="cursor-pointer text-primary"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
}
