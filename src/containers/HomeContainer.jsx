import React from "react";
import { Filters, TemplateDesing } from "../components";
import useTemplates from "../Hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import useFilters from "../Hooks/useFilters";

const HomeContainer = () => {
  const { data: templates, error: templateError } = useTemplates();

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
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
            <RenderTemplate templates={templates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  const { data: filterData } = useFilters();

  return (
    <React.Fragment>
      {templates && templates?.length > 0 ? (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates
                .filter((temp) => {
                  if (filterData.searchTerm.length > 0) {
                    return temp?.tags?.includes(filterData.searchTerm);
                  }
                  return true
                })
                .map((template, index) => (
                  <TemplateDesing
                    data={template}
                    key={template?._id}
                    index={index}
                  />
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
