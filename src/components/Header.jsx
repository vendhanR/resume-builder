import React, { useState } from "react";
import { Logo } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useUser from "../Hooks/useUser";
import { PuffLoader } from "react-spinners";
import { MdLogout } from "react-icons/md";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminId } from "../utils/helpers";
import useFilters from "../Hooks/useFilters";
import { fadeInFadeOut } from "../animation";
const Header = () => {
  const { data, error, isLoading } = useUser();
  const [isMenu, setIsMenu] = useState(false);

  const { data: filterData } = useFilters();

  const queryClient = useQueryClient();
  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueriesData("user", null);
    });
  };

  const handleSearch = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryDefaults("globalFilter"),
      searchTerm: e.target.value,
    });
  };
  const handleClearSearch = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryDefaults("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <header className="flex items-center justify-even lg:px-8  px-4 py-3 w-full gap-10 border-b border-gray-300 bg-primary z-50 sticky top-0">
      {/* logo */}
      <Link to={"/"}>
        <img src={Logo} className="w-8" />
      </Link>
      {/* input */}
      <div className="flex  border flex-1 items-center justify-between bg-gray-200 border-gray-300 px-4 py-1 rounded-md">
        <input
          onChange={handleSearch}
          value={filterData?.searchTerm ? filterData?.searchTerm : ""}
          type="text"
          className="flex-1 border-none   outline-none bg-transparent h-9 "
          placeholder="Search here..."
        />
        <AnimatePresence>
          {filterData?.searchTerm.length > 0 && (
            <motion.div 
            {...fadeInFadeOut}
            onClick={handleClearSearch}
            className="w-5 h-5 pb-1 flex justify-center items-center bg-gray-300 rounded-md cursor-pointer active:scale-75 duration-150">
              <p className="text-lg text-black">x</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* profile */}
      {isLoading ? (
        <>
          <PuffLoader color="#36d7b7" size={40} />
        </>
      ) : (
        <>
          {data ? (
            <>
              <AnimatePresence>
                <motion.div
                  onClick={() => setIsMenu(!isMenu)}
                  className="w-11 h-11 rounded flex items-center justify-center relative"
                >
                  {data.photoURL ? (
                    <img
                      src={data.photoURL}
                      className="rounded-md w-full h-full object-cover cursor-pointer "
                      referrerPolicy="no-referrer"
                      alt="logo"
                    />
                  ) : (
                    <div className="flex justify-center items-center bg-green-800 rounded-lg h-full w-full cursor-pointer ">
                      <p className="text-white text-lg ">{data.email[0]}</p>
                    </div>
                  )}
                </motion.div>
                {/* dropdown  */}
                {isMenu && (
                  <motion.div
                    onMouseLeave={() => setIsMenu(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute top-16 bg-slate-50 right-2 px-4 py-3 flex items-center justify-start flex-col gap-3  w-52 pt-8 shadow-lg"
                  >
                    <div className="w-11 h-11 rounded flex items-center justify-center  relative flex-col">
                      {data.photoURL ? (
                        <img
                          src={data.photoURL}
                          className="rounded-full w-full h-full object-cover "
                          referrerPolicy="no-referrer"
                          alt="logo"
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-green-800 rounded-lg h-full w-full">
                          <p className="text-white text-lg ">{data.email[0]}</p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-dark text-lg ">{data.displayName}</p>
                      )}
                    </div>

                    {/* menu */}
                    <div className="w-full flex flex-col items-start  gap-5 pt-6">
                      <Link
                        to={"/profile"}
                        className="text-gray-400 hover:text-gray-950 whitespace-nowrap text-base"
                      >
                        My Account
                      </Link>
                      {adminId.includes(data?.uid) && (
                        <Link
                          to={"/template/create"}
                          className="text-gray-400 hover:text-gray-950 whitespace-nowrap text-base"
                        >
                          Add New Template
                        </Link>
                      )}
                    </div>
                    <div
                      className="w-full border-t border-gray-300 flex items-center justify-between px-2 pt-2 text-gray-400 hover:text-gray-950 "
                      onClick={signOutUser}
                    >
                      <p>logout</p>
                      <MdLogout />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link to={"/auth"}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="bg-gray-200 hover:text-white hover:bg-gray-400 px-4 py-2 rounded border border-gray-300 duration-200 text-gray-600"
              >
                login
              </motion.div>
            </Link>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
