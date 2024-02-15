import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  getTemplateDetails,
  getTemplates,
  saveToCollection,
  saveToFavourites,
} from "../api";
import { MainSpinner, TemplateDesing } from "../components";
import { FaHouse } from "react-icons/fa6";
import { BiFolderMinus, BiFolderPlus, BiSolidHeart } from "react-icons/bi";
import useUser from "../Hooks/useUser";
import useTemplates from "../Hooks/useTemplates";
import { AnimatePresence } from "framer-motion";

const TemplateDesingPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["templateID", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();
  const { data: templates, refetch: templatesRefetch } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    refetch();
  };

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center ">
        <p className="text-lg text-gray-700 font-semibold">
          Error while fetching the data... Please try again later
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col gap-3 py-3 px-10">
      {/* nav section */}
      <div className="w-full flex items-center  gap-2 pb-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-gray-600"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* main section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
        {/* left section */}
        <div className="col-span-1 sm:col-span-7 lg:col-span-3 flex flex-col items-start justify-start gap-3 max-w-full ">
          <img
            src={data?.imageURl}
            alt=""
            className="max-w-full  object-contan rounded-md "
          />
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title scetion */}
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-500 font-semibold">
                {data?.title}
              </p>

              {/* likes */}
              {data?.favourites.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-red-500" />
                  <p className="text-sm font-semibold text-gray-500">
                    {" "}
                    {data?.favourites.length}Likes
                  </p>
                </div>
              )}
            </div>

            {/* collection and favourits */}
            <div className="flex justify-center items-center gap-1">
              {user?.collection?.includes(data?._id) ? (
                <React.Fragment>
                  <div
                    onClick={addToCollection}
                    className="flex justify-center items-center gap-2 border border-gray-500 px-1 py-1 rounded-md cursor-pointer"
                  >
                    <BiFolderMinus />
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      Remove From Collection
                    </p>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div
                    onClick={addToCollection}
                    className="flex justify-center items-center gap-2 border border-gray-500 px-1 py-1 rounded-md cursor-pointer"
                  >
                    <BiFolderPlus />
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      Add to Collection
                    </p>
                  </div>
                </React.Fragment>
              )}

              {data?.favourites?.includes(user?.uid) ? (
                <React.Fragment>
                  <div
                    onClick={addToFavourites}
                    className="flex justify-center items-center gap-2 border border-gray-500 px-1 py-1 rounded-md cursor-pointer"
                  >
                    <BiFolderMinus />
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      Remove From Favourites
                    </p>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div
                    onClick={addToFavourites}
                    className="flex justify-center items-center gap-2 border border-gray-500 px-1 py-1 rounded-md cursor-pointer"
                  >
                    <BiFolderPlus />
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      Add to Favourites
                    </p>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        {/* right secction */}
        <div className="max-w-full col-span-1 sm:col-span-5 lg:col-span-4 flex flex-col justify-start items-center gap-3 ">
          {/* discover more  */}
          <div
            className="w-full h-56 bg-amber-400 rounded-md overflow-hidden relative "
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2016/01/08/17/06/poppy-1128683_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0  flex justify-center items-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="border-2 border-gray-50 rounded-md text-white px-4 py-2"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* edit option */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateID${templateID}`}
              className="w-full px-4 py-2 rounded-md flex justify-center items-center bg-emerald-500 "
            >
              <p className="text-lg text-white font-semibold ">
                Edit this Template
              </p>
            </Link>
          )}

          <div className="w-full flex justify-start items-center flex-wrap gap-2">
            {data?.tags?.map((tag, index) => (
              <div
                key={index}
                className="text-xs px-2 py-1 whitespace-nowrap rounded-md border border-gray-300"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* suggection */}
      {templates?.filter((temp) => temp?._id !== data?._id).length> 0 && (
        <div className="w-full flex justify-start items-start flex-col py-3 gap-4 ">
          <p className="text-lg font-semibold text-gray-900">
            You might also like
          </p>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <React.Fragment>
          <AnimatePresence>

            {
              templates?.filter((temp) => temp?._id !== data?._id).map((template, index) => (
                <TemplateDesing data={template} key={template?._id} index={index}/>

              ))}
          </AnimatePresence>
        </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesingPinDetails;
