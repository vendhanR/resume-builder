import React from "react";
import { Filters, TemplateDesing } from "../components";
import useTemplates from "../Hooks/useTemplates";
import { AnimatePresence } from "framer-motion";

const HomeContainer = () => {
  const {
    data: templates,
    error: templateError,
    isLoading: templateLoading,
    refetch: templateRefetch,
  } = useTemplates();

  return (
    <div className="w-full flex justify-center items-center flex-col px-4 lg:px-10 2xl:px-20">
      {/* filters */}
      <Filters />
      {/*renter  templatwes  */}
      {templateError ? (
        <React.Fragment>
          <p>Something went wrong... Please try again later</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <RenderTemplate templates={templates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

 const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates?.length > 0 ? (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesing 
                data={template} 
                key={template?._id}
                index={index}/>
              ))}
          </AnimatePresence>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>No Data</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default HomeContainer;
