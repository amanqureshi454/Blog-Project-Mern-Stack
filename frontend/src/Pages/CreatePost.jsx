import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";

const CreatePost = () => {
  const token = localStorage.getItem("token");

  const [postInfo, setPostInfo] = useState({
    title: "",
    summary: "",
    file: null,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setPostInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", postInfo.title);
      data.append("summary", postInfo.summary);
      data.append("file", postInfo.file);
      data.append("description", postInfo.description);

      const sendingPost = await fetch(`${window.location.origin}/createpost`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`, // Include your authorization token
        },
      });
      console.log(data);

      const postResult = await sendingPost.json();
      if (sendingPost.ok) {
        Swal.fire({
          position: "top-center",
          background: "#000",
          color: "#fff",
          icon: "success",
          title: "Post Created Successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "dark-mode", // Apply a class for dark mode styling
            content: "dark-mode-content", // Additional class for content if needed
          },
        });
      }
      setPostInfo({
        title: "",
        summary: "",
        file: null,
        description: "",
      });

      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.value = null;
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <>
      <Navbar />
      <div className="create__post container mx-auto mt-10 gap-1 xl:px-60 lg:px-30 flex justify-start flex-col items-center">
        <form
          onSubmit={handleCreatePost}
          encType="multipart/form-data"
          className="px-2"
        >
          <div className="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   dark:bg-black dark:border-gray-300 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                placeholder="Upload Image"
                name="file"
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="mb-3 mt-3">
            <input
              type="text"
              id="default-input"
              placeholder="Heading"
              name="title"
              value={postInfo.title}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-black dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              id="default-input-2"
              placeholder="Summary"
              name="summary"
              value={postInfo.summary}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-black dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            />
          </div>
          <ReactQuill
            theme="snow"
            className="text-left text-white mt-2 w-full dark:bg-black rounded-lg  dark:border-gray-300"
            placeholder="Description"
            value={postInfo.description}
            modules={modules}
            onChange={(newValue) =>
              setPostInfo((prevInfo) => ({
                ...prevInfo,
                description: newValue,
              }))
            }
          />
          <button
            className="py-3 mt-3 px-6 flex justify-center items-center w-max bg-black text-white rounded-full hover:opacity-90 hover:bg-gray-800"
            type="submit"
          >
            Publish Post
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
