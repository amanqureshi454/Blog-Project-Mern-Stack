import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Navigate } from "react-router-dom";

const EditPost = () => {
  const [post, setPost] = useState([]);
  const [file, setFile] = useState(null); // Add state for file
  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
      const file = e.target.files[0];
      setFile(file); // Update file state
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchasync = async () => {
      try {
        const response = await fetch(`${window.location.origin}/getPost/${id}`);
        const responseData = await response.json();
        if (response.ok) {
          setPost(responseData.data);
          // console.log(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchasync();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(); // Create FormData object to append data
      formData.append("id", id); // Append post ID
      formData.append("title", post.title); // Append updated title
      formData.append("summary", post.summary); // Append updated summary
      formData.append("description", post.description); // Append updated description
      if (file) {
        formData.append("file", file); // Append updated file if selected
      }

      const sendingPost = await fetch(`${window.location.origin}/editPost/${id}`, {
        method: "PUT",
        body: formData, // Send form data
      });

      const postResult = await sendingPost.json();
      if (sendingPost.ok) {
        Swal.fire({
          position: "top-center",
          background: "#000",
          color: "#fff",
          icon: "success",
          title: "Post Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "dark-mode",
            content: "dark-mode-content",
          },
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }

      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.value = null;
      }
    } catch (err) {
      console.log(err);
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
      <div className="create__post container mx-auto mt-10 gap-1 xl:px-60 lg:px-30 flex justify-start flex-col items-center mb-10">
        <form
          onSubmit={handleCreatePost}
          encType="multipart/form-data"
          className="px-2"
        >
          <div className="flex items-left flex-col gap-3 justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300  rounded-lg  bg-gray-50   dark:bg-black dark:border-gray-300 "
            >
              <div className="h-[250px] w-full ">
                {file && (
                  <img
                    className="object-cover m-auto w-full h-[250px] "
                    src={URL.createObjectURL(file)}
                    alt=""
                  />
                )}

                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleInputChange}
                  name="file"
                />
              </div>
            </label>
            <label htmlFor="fileInput" className="">
              <PlusIcon className="w-10 h-10 rounded-full border-2 cursor-pointer border-black text-black" />
            </label>
          </div>
          <div className="mb-3 mt-3">
            <input
              type="text"
              id="default-input"
              placeholder="Heading"
              name="title"
              value={post.title}
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
              value={post.summary}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-black dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            />
          </div>
          <ReactQuill
            theme="snow"
            className="text-left text-white mt-2 w-full dark:bg-black rounded-lg  dark:border-gray-300"
            placeholder="Description"
            value={post.description}
            modules={modules}
            onChange={(newValue) =>
              setPost((prevPost) => ({ ...prevPost, description: newValue }))
            }
          />
          <button
            className="py-3 mt-3 px-6 flex justify-center items-center w-max bg-black text-white rounded-full hover:opacity-90 hover:bg-gray-800"
            type="submit"
          >
            Update Post
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPost;
