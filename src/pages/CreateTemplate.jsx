import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { storage } from "../config/firebase.config";

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

  console.log(imageAsset.imageLoading);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };
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
          }).then(() => {

              toast.success("image added successfully")
        setImageAsset((prev) => ({ ...prev, imageLoading: true }));
          })
        }
      );
    } else {
      toast.info("Invalid file type");
    }
  };

  function getFileType(type) {
    const acceptableTypes = ["image/png", "image/jpg", "image/jpeg"];

    return acceptableTypes.includes(type);
  }

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 md:grid-cols-12">
      {/* left container */}
      <div className=" col-span-12 md:col-span-4 2xl:col-span-3 flex flex-1 justify-start items-center flex-col gap-2 px-2">
        <div className="w-full">
          <p className="text-lg text-gray-400">Create a new template </p>
        </div>
        {/* template id section  */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base uppercase font-medium text-gray-400">
            TemplateID :{" "}
          </p>
          <p className="text-sm capitalize text-dark">template1</p>
        </div>
        {/* template file section */}
        <input
          className="w-full outline-none px-3 py-2 rounded-md bg-transparent border border-gray-300 text-lg text-gray-400 focus:text-gray-600 focus:shadow-sm "
          placeholder="Template Title"
          name="title"
          type="text"
          onChange={handleInputChange}
          value={inputData?.title}
        />
        <div className="w-full bg-slate-100 backdrop-blur-md h-[320px] lg:h-[420px] 2xl:h-[640px] rounded-md border-2 border-dotted border-gray-400 cursor-pointer flex items-center justify-center ">
          {imageAsset?.imageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full h-full flex items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex items-center justify-center flex-col gap-2 cursor-pointer">
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
                    <img src={imageAsset?.uri} alt="image" className="w-full h-full object-cover" loading="lazy"/>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-8">2</div>
      {/* right container */}
    </div>
  );
};

export default CreateTemplate;
