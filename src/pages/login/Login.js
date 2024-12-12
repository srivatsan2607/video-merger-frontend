import React, { useState } from "react";
import logo from "../../assets/streak.png";
import { ToastContainer, toast } from "react-toast";
import axios from "axios";
import config from "../../utils/config";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const signInHandler = () => {
    if (username === "" || password === "") {
      toast.error("Username or password empty!");
    } else {
      axios
        .post(`${config.serverUrl}/login`, {
          username: username,
          password: password,
        })
        .then((response) => {
          const data = response.data;
          localStorage.setItem("authToken", data.token);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data.message);
        });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 items-center min-h-screen bg-gradient-to-r from-violet-100 to-blue-200 [background-size:75%_100%,25%_100%] p-5">
      <div className="grid lg:justify-items-end justify-items-center w-full">
        <div className="w-3/4">
          <header className="text-9xl font-extrabold font-serif">STREAK</header>
          <p className="text-xs text-grey-100">
            Seamlessly Merge Videos with Real-Time Progress Tracking 🎥✨
          </p>

          <p className="mt-20 font-sans font-medium text-slate-800 text-justify">
            This app simplifies video editing by allowing users to upload
            multiple videos, which are then merged into a single file. It
            provides a real-time job status tracker to keep users updated on the
            merging process and displays the final merged video upon completion.
            Perfect for creating compilations, presentations, or personalized
            video content with ease.
          </p>
        </div>
      </div>
      <div className="grid justify-items-center">
        <div className="w-full max-w-md p-6 m-5 bg-white rounded-lg shadow-md">
          {/* Logo and Heading */}
          <div className="flex items-center">
            {" "}
            <img
              src={logo} // Replace with your logo
              alt="Logo"
              className="w-12 mb-2"
            />
            <span className="font-light italic">STREAK</span>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome to Streak! 👋
            </h2>
            <p className="text-sm text-gray-500">
              Please sign in to your account
            </p>
          </div>

          {/* Form */}
          <div>
            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email or username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="text"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-blue-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md my-5"
              onClick={() => signInHandler()}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" delay={3000} />
    </div>
  );
};

export default LoginPage;
