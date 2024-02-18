import React, { useEffect, useState } from "react";
import useUser from "../Hooks/useUser";
import useTemplates from "../Hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesing } from "../components";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTap, setActiveTap] = useState("Collections");
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: templates } = useTemplates();

  const { data: savedResumes, isLoading: savedResumeIsLoading } = useQuery(
    ["savedResumes"],
    () => getSavedResumes(user?.uid)
  );

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [isUserLoading, savedResumeIsLoading, user, navigate]);

  if (isUserLoading || savedResumeIsLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-7">
      {user && (
        <React.Fragment>
          <div className="w-full flex flex-col justify-center items-center relative ">
            <img
              src="https://cdn.pixabay.com/photo/2016/07/12/19/08/laptop-1512838_1280.png"
              className="w-full h-40 object-cover "
            />
            <div className="absolute w-16 h-16 bg-slate-500 -bottom-7 rounded-full">
              {user?.photoURL ? (
                <img
                  src={user?.photoURL}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295395_1280.png"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </div>
          <div className="w-full flex justify-center items-center ">
            <p className="text-2xl whitespace-nowrap">{user?.displayName}</p>
          </div>
        </React.Fragment>
      )}

      {/* taps */}
      <div className="w-full flex justify-center items-center gap-6">
        <div
          onClick={() => setActiveTap("Collections")}
          className={`px-2 py-1 rounded-md flex justify-center items-center gap-2 group cursor-pointer ${
            activeTap === "Collections" && "bg-white shadow-md"
          }`}
        >
          <p className="text-base text-gray-500 px-3 py-1 group-hover:text-blue-600 rounded-md ">
            Collections
          </p>
        </div>
        <div
          onClick={() => setActiveTap("Resumes")}
          className={`px-2 py-1 rounded-md flex justify-center items-center gap-2 group cursor-pointer ${
            activeTap === "Resumes" && "bg-white shadow-md"
          }`}
        >
          <p className="text-base text-gray-500 px-3 py-1 group-hover:text-blue-600 rounded-md ">
            My Resumes
          </p>
        </div>
      </div>
      <div className="w-full flex justify-center gap-4">
        <AnimatePresence>
          {activeTap === "Collections" && (
            <React.Fragment>
              {user?.collection?.length > 0 ? (
                <RenderTemplate
                  templates={templates?.filter((temp) =>
                    user?.collection?.includes(temp?._id)
                  )}
                />
              ) : (
                <div className="w-full flex flex-col items-center justify-center ">
                  <img
                    src={NoData}
                    className="w-60 h-full object-cover rounded-full"
                  />
                  No Data
                </div>
              )}
            </React.Fragment>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeTap === "Resumes" && (
            <React.Fragment>
              {savedResumes && savedResumes?.length > 0 ? (
                    <RenderTemplate templates={savedResumes} />
              ) : (
                <div className="w-full flex flex-col items-center justify-center ">
                  <img
                    src={NoData}
                    className="w-60 h-full object-cover rounded-full"
                  />
                  No Data
                </div>
              )}
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesing
                  data={template}
                  key={template?._id}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
