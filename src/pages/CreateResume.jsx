import React from "react";
import { FaHouse } from "react-icons/fa6";
import { Link, Route, Routes } from "react-router-dom";
import { TemplatesData } from "../utils/helpers";

const CreateResume = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center px-10 py-3">
      <Routes>
        {TemplatesData.map((template) => (
          <Route
            key={template.id}
            path={`/${template.name}`}
            Component={template.component}
          />
        ))}
      </Routes>

      {/* routes section */}
      {/* <div className="w-full flex items-center  gap-2 pb-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-gray-600"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p> */}
        {/* <p>{data?.name}</p> */}
      {/* </div> */}
    </div>
  );
};

export default CreateResume;
