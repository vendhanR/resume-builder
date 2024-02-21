import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { FiltersData } from "../utils/helpers";
import { isClearAllMouseEnterAndLeave } from "../animation";
import useFilters from "../Hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {

  const [isClearAllMouseHover, setIsClearAllMouseHover] = useState(false);

  const {data: filterData } = useFilters()

  const queryClient = useQueryClient();

  const handleFiltersClick =(value) => {
    queryClient.setQueryData("globalFilter", {...queryClient.getQueryData("globalFilter"),searchTerm : value})
  }

  const handleClearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <div className="w-full flex justify-start items-center py-2  gap-3">
      <div
        onClick={handleClearFilter}
        onMouseEnter={() => setIsClearAllMouseHover(true)}
        onMouseLeave={() => setIsClearAllMouseHover(false)}
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
      >
        <MdLayersClear className="text-xl" />
        {isClearAllMouseHover && (
          <AnimatePresence>
            <motion.div
              {...isClearAllMouseEnterAndLeave}
              className="absolute  -top-6 -right-1 bg-white rounded-md px-1 z-50"
            >
              <p className="whitespace-nowrap text-xs text-black">
                Clear all
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={() => handleFiltersClick(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-4 py-2 cursor-pointer group hover:shadow-lg  ${filterData?.searchTerm === item.value && 'bg-gray-200 text-black'}`}
            >
              <p className="whitespace-nowrap text-sm text-gray-600 group-hover:text-black">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filters;
