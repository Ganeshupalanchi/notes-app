import React from "react";

export default function EmptyCard({ message, imgSrc }) {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <img src={imgSrc} alt="" className="w-60" />
      <p className="mt-5 w-1/2 text-center text-sm font-medium leading-7 text-slate-700">
        {message}
      </p>
    </div>
  );
}
