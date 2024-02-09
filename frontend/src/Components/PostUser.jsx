import React, { useEffect, useState } from "react";
import {
  ClockIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const PostUser = () => {
  const [post, setPost] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchPostbyUserId = async () => {
      try {
        const postResponse = await fetch(
          `${window.location.origin}/getPostbyUserId`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const postResponseData = await postResponse.json();
        setPost(postResponseData.postByUserId);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchPostbyUserId();
  }, []);
  const handleDeletePost = async (postId) => {
    // Show confirmation alert
    const result = await Swal.fire({
      background: "#000",
      color: "#fff",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        // Make DELETE request to delete the post
        const response = await fetch(`${window.location.origin}/posts/${postId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include your authorization token
          },
        });
        if (response.ok) {
        
          console.log("Post deleted successfully");
        } else {
          throw new Error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        // Show error alert
        Swal.fire({
          background: "#000",
          color: "#fff",
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while deleting the post!",
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // User clicked on "Cancel" button
      // Show cancellation message
      Swal.fire({
        title: "Cancelled",
        color: "#fff",
        background: "#000",
        text: "Your post is safe :)",
        icon: "error",
        customClass: {
          popup: "bg-black",
          title: "text-white",
          content: "text-white",
        },
      });
    }
  };
  // Fetch posts

  return post && post.length > 0 ? (
    post.map((post) => {
      const createdAtDate = new Date(post.createdAt);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      const formattedDate = createdAtDate.toLocaleDateString("en-GB", options);

      const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const formattedTime = createdAtDate.toLocaleTimeString(
        "en-US",
        timeOptions
      );

      const finalFormattedDate = `${formattedDate} ${formattedTime.toLowerCase()}`;

      return (
        <div
          key={post._id} // Make sure to provide a unique key for each element in the list
          className="p-6 sm:p-12 mt-6 bg-[#f1f1f1] dark:text-gray-100"
        >
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
            <img
              src={`${window.location.origin}/${post.file}`}
              alt=""
              className="self-center flex-shrink-0 w-24 h-24 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700"
            />
            <div className="flex flex-col">
              <h4 className="text-lg text-black font-semibold text-justify md:text-left">
                {post.title}
              </h4>
              <p className="dark:text-black text-justify lg:mt-0 mt-2">
                {post.summary}
              </p>
              <p className="dark:text-black font-semibold mt-1 flex justify-start items-center mt-2 ">
                Publish : {finalFormattedDate}
              </p>
              <div className="edit__delete flex justify-start items-center gap-3 ">
                <Link
                  to={`/editpost/${post._id}`}
                  className="text-lg text-blue-600 cursor-pointer"
                >
                  Edit{" "}
                  <PencilIcon className="w-4 h-4 ml-1 inline text-blue-600" />
                </Link>
                <p
                  className="text-lg text-red-600 cursor-pointer"
                  onClick={() => handleDeletePost(post._id)}
                >
                  Delete{" "}
                  <TrashIcon className="w-4 h-4 ml-1 inline text-red-600" />
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <h1 className="text-center text-black text-3xl">
      You haven't posted anything yet
    </h1>
  );
};

export default PostUser;
