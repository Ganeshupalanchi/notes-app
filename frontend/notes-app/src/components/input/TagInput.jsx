import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

export default function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      if (tags.includes(inputValue)) {
        window.alert("This tag is already exist..");
        return;
      }
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };
  const handleRemoveTags = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div>
      {tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {tags.map((tag, i) => {
            return (
              <span
                key={i}
                className="flex items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-900"
              >
                # {tag}
                <button
                  onClick={() => {
                    handleRemoveTags(tag);
                  }}
                >
                  <MdClose />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="mt-3 flex items-center gap-4">
        <input
          type="text"
          className="border bg-transparent px-3 py-2 text-sm outline-none"
          placeholder="Add tags"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="flex h-8 w-8 items-center justify-center rounded border border-blue-700 hover:bg-blue-700 hover:text-white"
          onClick={() => addNewTag()}
        >
          <MdAdd className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
