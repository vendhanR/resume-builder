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
    </div>
  );
};

export default CreateResume;
