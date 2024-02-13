import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import { motion } from "framer-motion";
import { adminId, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../Hooks/useTemplates";
import MainSpinner from "../components/MainSpinner";
import { useNavigate } from "react-router-dom";
import useUser from "../Hooks/useUser";

const CreateTemplate = () => {
  const [inputData, setInputData] = useState({
    title: "",
    imageURL: null,
  });
  const [imageAsset, setImageAsset] = useState({
    imageLoading: false,
    uri: null,
    progress: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const {
    data: templates,
    error: templateError,
    isLoading: templateLoading,
    refetch: templateRefetch,
  } = useTemplates();

  const { data: user, isLoading: userIsLoading } = useUser();

  //hadle the title input field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  //handle the image upload and diplay functionality
  const handleSelect = (e) => {
    setImageAsset((prev) => ({ ...prev, imageLoading: true }));
    const file = e.target.files[0];
    if (file && getFileType(file.type)) {
      const storageRef = ref(storage, `Template/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prevState) => ({
            ...prevState,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prevState) => ({
              ...prevState,
              uri: downloadURL,
            }));
          });

          toast.success("image uploaded");
          setTimeout(() => {
            setImageAsset((prev) => ({ ...prev, imageLoading: false }));
          }, 2000);

          console.log("new");
        }
      );
    } else {
      toast.info("Invalid file type");
    }
  };

  //handle the image delete
  const handleAnImageDelete = async () => {
    setTimeout(() => {
      setImageAsset((prev) => ({
        ...prev,
        progress: 0,
        uri: null,
        imageLoading: false,
      }));
    }, 2000);
    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef)
      .then(() => {
        toast.success("image removed");
      })
      .catch((error) => {
        toast.error("something went wrong");
      });
  };
  function getFileType(type) {
    const acceptableTypes = ["image/png", "image/jpg", "image/jpeg"];
    return acceptableTypes.includes(type);
  }

  const handleSelectTags = (tag) => {
    //check if tags already select or not
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((tags) => tag !== tags));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: inputData.title,
      imageURl: imageAsset.uri,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timestamp: timestamp,
    };
    await setDoc(doc(db, "Templates", id), _doc)
      .then(() => {
        setInputData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
        setImageAsset((prevAsset) => ({ ...prevAsset, uri: null }));
        setSelectedTags([]);
        templateRefetch();
        toast.success("data pushed to the cloud");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAnResumeTemplateDelete = async (template) => {
    const deleteRef = ref(storage, template.imageURl);
    await deleteObject(deleteRef)
      .then(async () => {
        await deleteDoc(doc(db, "Templates", template._id));
        toast.success("Template deleted from cloud");
        templateRefetch();
      })
      .catch((error) => {
        toast.error(`Error :${error.message} `);
      });
  };

  useEffect(() => {
    if (!userIsLoading && !adminId.includes(user?.uid)) {
      navigate("/", { replace: true });
    }
  }, [user, userIsLoading]);

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 sm:grid-cols-12  ">
      {/* left container */}
      <div className="col-span-12 sm:col-span-3  2xl:col-span-4 flex flex-1 justify-start items-center flex-col gap-2 px-2 ">
        <div className="w-full">
          <p className="text-sm text-gray-400">Create a new template </p>
        </div>
        {/* template id section  */}
        <div className="w-full flex items-center justify-end">
          <p className="text-sm uppercase font-medium text-gray-400">
            TemplateID :{" "}
          </p>
          <p className="text-sm capitalize text-dark">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
        </div>
        {/* template file section */}
        <input
          className="w-full outline-none px-3 py-1 rounded-md bg-transparent border border-gray-300 text-lg text-gray-400 focus:text-gray-600 focus:shadow-sm "
          placeholder="Template Title"
          name="title"
          type="text"
          onChange={handleInputChange}
          value={inputData?.title}
        />
        <div className="w-full bg-slate-100 backdrop-blur-md h-[200px] sm:h-[200px] 2xl:h-[440px] rounded-md border-2 border-dotted border-gray-400 cursor-pointer flex items-center justify-center ">
          {imageAsset?.imageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center cursor-progress">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full h-full flex items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex items-center justify-center flex-col gap-2 cursor-pointer ">
                      <FaUpload className="text-2xl" />
                      <p className="text-lg text-gray-500">Click To upload</p>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.uri}
                      alt="image"
                      className="w-full h-full object-contain cursor-default"
                      loading="lazy"
                    />
                    <motion.div
                      className="absolute z-50 top-4 right-4 bg-red-500 w-8 h-8 rounded-md flex items-center justify-center"
                      onClick={handleAnImageDelete}
                    >
                      <FaTrash className="text-white " />
                    </motion.div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="w-full flex flex-wrap items-center gap-1 overflow-x-auto">
          {initialTags.map((tag, i) => (
            <div
              key={i}
              onClick={() => handleSelectTags(tag)}
              className={`px-1 py-1 border border-gray-500 rounded-sm cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
            >
              <p className="text-[8px] 2xl:text-[20px]">{tag}</p>
            </div>
          ))}
        </div>
        <button
          className="w-full bg-blue-700 rounded-sm text-white my-1 py-1"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>
      <div className="col-span-12 sm:col-span-9 ">
        {templateLoading ? (
          <React.Fragment>
            <MainSpinner />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className="overflow-hidden rounded-md w-full h-[350px] relative p-2 bg-gray-300 "
                    >
                      <img
                        src={template?.imageURl}
                        alt="resume template"
                        className="object-cover w-full h-full"
                      />
                      <motion.div
                        className="absolute z-50 top-4 right-4 bg-red-500 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer"
                        onClick={() => handleAnResumeTemplateDelete(template)}
                      >
                        <FaTrash className="text-white " />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="flex justify-center items-center ">No data</div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
