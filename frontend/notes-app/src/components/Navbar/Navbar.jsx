import React, { useEffect, useState } from "react";
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

export default function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchQuery) {
      toast.warning("Search query is required. ");
      return;
    }
    onSearchNote(searchQuery);
    // setSearchQuery("");
  };
  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  // useEffect(() => {
  //   if (!searchQuery) {
  //     handleClearSearch();
  //   }
  // }, [searchQuery]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="flex items-center justify-between bg-white px-6 py-2 drop-shadow">
      <h2 className="text py-2 text-xl font-medium text-black">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        handleKeyDown={handleKeyDown}
      />
      <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
    </div>
  );
}
