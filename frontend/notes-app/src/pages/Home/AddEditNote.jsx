import React, { useState } from "react";
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddEditNote({ noteData, type, onClose, getAllNotes }) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Add Notes
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data.note) {
        toast.success("Note Created Successfully...!");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Notes
  const editNote = async () => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });
      if (response.data.note) {
        // console.log(response.data.message);
        toast.success("Note Updated Successfully...!");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = async () => {
    if (!title) {
      setError("Please enter the title.");
      return;
    }
    if (!content) {
      setError("Please enter the content.");
      return;
    }
    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className="relative">
      <button
        className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2 pt-5">
        <label htmlFor="" className="input-label">
          TITLE
        </label>
        <input
          type="text"
          className="border p-2 text-xl text-slate-950 outline-none"
          placeholder="Go to gym at 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="" className="input-label">
          CONTENT
        </label>
        <textarea
          name=""
          className="rounded border bg-slate-50 p-2 text-sm text-slate-950 outline-none"
          id=""
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className="mt-3">
        <label htmlFor="" className="input-label">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && (
        <p className="pt-4 text-xs font-medium text-red-500">{error}</p>
      )}
      <button
        className="btn-primary mt-5 p-3 font-medium"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
}
