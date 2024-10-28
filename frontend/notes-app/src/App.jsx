import { useState } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
