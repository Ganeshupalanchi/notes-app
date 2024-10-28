import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export default function SearchBar({
  value,
  onChange,
  handleSearch,
  onClearSearch,
  handleKeyDown,
}) {
  return (
    <div className="flex w-80 items-center rounded-md bg-slate-100 px-4">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full bg-transparent py-[11px] text-xs outline-none"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <IoMdClose
          className="mr-3 cursor-pointer text-xl text-slate-500 hover:text-black"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="cursor-pointer text-slate-400 hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
}
