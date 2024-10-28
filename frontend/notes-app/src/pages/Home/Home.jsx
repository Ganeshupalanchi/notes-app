import React, { useEffect, useState } from "react";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd, MdDelete } from "react-icons/md";
import AddEditNote from "./AddEditNote";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNoteimg from "../../assets/images/add-notes.png";
import noNotes from "../../assets/images/no-notes.png";
export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);

  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEditNote = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  //Get User
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("./login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axiosInstance.delete("delete-note/" + noteId);

      if (response) {
        toast.error("Note Deleted Successfully...!", {
          icon: <MdDelete size={20} color="red" />,
        });
        getAllNotes();
      }
    } catch (error) {
      if (error.response.data.message) {
        console.log(error.response.data.message);
      }
    }
  };

  //Search for a note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("search-notes", {
        params: { query },
      });

      if (response.data) {
        setIsSearch(true);
        // console.log(response.data);
        setAllNotes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Update Pinned Note

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
      isPinned: !noteData.isPinned,
    });
    if (response) {
      getAllNotes();
    }
  };
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container px-4">
        {allNotes.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {allNotes?.map((item, i) => {
              return (
                <NoteCard
                  key={i}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => {
                    handleEditNote(item);
                  }}
                  onDelete={() => {
                    handleDeleteNote(item._id);
                  }}
                  onPinNote={() => {
                    updateIsPinned(item);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? noNotes : addNoteimg}
            message={
              isSearch
                ? "Oops! No notes found matching your search. "
                : `Start creating your first note! Click the "Add" button to jot down your thoughts , ideas and reminders. Let's get Started.`
            }
          />
        )}
      </div>
      <button
        className="fixed bottom-10 right-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary hover:bg-blue-600"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
        }}
        contentLabel=""
        className="max-h-3/4 mx-auto mt-14 w-[40%] overflow-auto rounded-md bg-white p-5"
        ariaHideApp={false}
      >
        <AddEditNote
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
}
