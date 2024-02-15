import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scaleInOut } from "../animation";
import {
  BiFolderPlus,
  BiHeart,
  BiFolderMinus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../Hooks/useUser";
import { saveToCollection, saveToFavourites } from "../api";
import useTemplates from "../Hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesing = ({ data, index }) => {
  const [isTemplateHover, setIsTemplateHover] = useState(false)
  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: templateRefetch } = useTemplates();

  const navigate = useNavigate()

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollection(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templateRefetch();
  };

  const navigateToTemplateDetailsView =() => {
    navigate(`/templateDetails/${data?._id}`,{replace : true})
  }

  return (
    <motion.div {...scaleInOut(index)} key={data?._id}>
      <div
      onMouseEnter={() => setIsTemplateHover(true)}
      onMouseLeave={() => setIsTemplateHover(false)}
       className="w-full h-[300px] 2xl:h-[640px]  rounded-md  bg-gray-200 overflow-hidden relative">
        <img
          src={data?.imageURl}
          className="w-full h-full object-contain"
          alt="templates"
        />

        <AnimatePresence>
          {isTemplateHover && <motion.div
          onClick={ navigateToTemplateDetailsView }
          className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-end justify-start px-3 py-2 z-50 cursor-pointer ">
            <div className="flex flex-col items-end justify-start gap-4 w-full">
              <InnerBoxDesign
                label={
                  user?.collection?.includes(data?._id)
                    ? "Remove from coll"
                    : "Add to Collection"
                }
                Icon={
                  user?.collection?.includes(data?._id)
                    ? BiFolderMinus
                    : BiFolderPlus
                }
                onHandle={addToCollection}
              />
              <InnerBoxDesign
                label={
                  data?.favourites?.includes(user?.uid)
                    ? "Remove from fav"
                    : "Add to Favourites"
                }
                Icon={
                  data?.favourites?.includes(user?.uid) ? BiSolidHeart : BiHeart
                }
                onHandle={addToFavourites}
              />
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxDesign = ({ label, Icon, onHandle }) => {
  const [isLabelShow, setisLabelShow] = useState(false);
  return (
    <div
      onClick={onHandle}
      onMouseEnter={() => setisLabelShow(true)}
      onMouseLeave={() => setisLabelShow(false)}
      className="bg-gray-200 w-6 h-6 flex justify-center items-center relative hover:shadow-md rounded-sm"
    >
      <Icon className={`text-xs ${label === "Remove from fav" && 'text-red-500'}`} />
      <AnimatePresence>
        {isLabelShow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 25 }}
            className="bg-gray-200 p-1 rounded-sm absolute -left-28 after:absolute after:z-20 after:w-2 after:h-2 after:bg-gray-200 after:-right-1 after:top-2 after:rotate-45"
          >
            <p className="whitespace-nowrap text-xs ">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesing;
