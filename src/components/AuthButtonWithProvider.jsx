import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

const AuthButtonWithProvider = ({ Icon, label, provider }) => {
  const googleAuthProvider = new GoogleAuthProvider();
  const githubAuthProvider = new GithubAuthProvider();

  const handleClick = async () => {
    try {
      if (provider === "GoogleAuthProvider") {
        await signInWithRedirect(auth, googleAuthProvider)
          .then((result) => console.log(result))
          .catch((err) => console.log(err.message));
      } else {
        await signInWithRedirect(auth, githubAuthProvider)
          .then((result) => console.log(result))
          .catch((err) => console.log(err.message));
      }
    } catch (error) {
      console.log("AuthProvider", error.message);
    }
  };
  return (
    <div
      onClick={handleClick}
      className="w-full border-blue-700 border-2 py-3 px-4 flex items-center justify-around gap-5 rounded hover:bg-blue-700 duration-150 cursor-pointer hover:text-gray-50 active:scale-95"
    >
      <Icon className="text-xl text-gray-600" />
      {label}
      <FaChevronRight className="text-base" />
    </div>
  );
};

export default AuthButtonWithProvider;
