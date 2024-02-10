import React, { useEffect } from "react";
import { Logo } from "../assets";
import { Footer } from "../containers";
import { AuthButtonWithProvider, MainSpinner } from "../components";
import { FaGoogle, FaGithub } from "react-icons/fa";
import useUser from "../Hooks/useUser";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const { data, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [data, isLoading]);
  if (isLoading) {
    return <MainSpinner />;
  }
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden items-start justify-start px-6 py-4 gap-6">
      {/* top section */}
      <img className="w-10 h-auto object-contain" src={Logo} alt="logo" />
      {/* main section */}
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="text-2xl text-blue-800 lg:text-4xl">
          Welcome to Expressume
        </h1>
        <p className="text-base text-gray-600 ">express way to create resume</p>
        <h3 className="text-2xl text-gray-600">Authenticate</h3>
        <div className=" w-full sm:w-96 rounded-md p-2 flex flex-col  items-center justify-star gap-6">
          <AuthButtonWithProvider
            Icon={FaGoogle}
            label={"Signin with Google"}
            provider={"GoogleAuthProvider"}
          />
          <AuthButtonWithProvider
            Icon={FaGithub}
            label={"Signin with GitHub"}
            provider={"GithubAuthProvider"}
          />
        </div>
      </div>
      {/* footer section */}
      <Footer />
    </div>
  );
};

export default Authentication;
