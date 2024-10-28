import moment from "moment";
import React from "react";
import { AiOutlinePushpin } from "react-icons/ai";
import {
  MdCreate,
  MdDelete,
  MdOutlinePushPin,
  MdPushPin,
} from "react-icons/md";

export default function NoteCard({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) {
  return (
    <div className="rounded border bg-white p-4 transition-all ease-in-out hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        {isPinned ? (
          <MdPushPin className={`icon-btn text-primary`} onClick={onPinNote} />
        ) : (
          <MdOutlinePushPin className={`icon-btn`} onClick={onPinNote} />
        )}
      </div>
      <p className="mt-2 text-xs text-slate-600">{content?.slice(0, 60)}</p>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {tags.map((tag, i) => `#${tag} `)}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
