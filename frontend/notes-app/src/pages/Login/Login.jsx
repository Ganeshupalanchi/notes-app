import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Plase enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setError("");

    // login api call

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      if (response.data && response.data.accessToken) {
        toast.success("Login Successfully.");
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured, Please try again.");
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="mt-28 flex select-none items-center justify-center">
        <div className="w-96 rounded border bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="mb-7 text-2xl">Login</h4>
            <input
              type="email"
              placeholder="Enter Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="pb-1 text-sm text-red-500">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="mt-4 text-center text-sm">
              Not registered yet ?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
