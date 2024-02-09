import React, { useEffect, useState } from "react";
import {
  ClockIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
const CommentUser = () => {
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentRes = await fetch(`${window.location.origin}/getComment`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
          },
        });
        const commentsResData = await commentRes.json();
        setComments(commentsResData?.comments); // Access 'comments' property
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchComments();
  }, []);
  const formatTimeDifference = (createdAt) => {
    const timeDifference = Date.now() - new Date(createdAt).getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference > 0) {
      return `${hoursDifference}h ago`;
    } else {
      return "Just now";
    }
  };
  return (
    <div className="comments">
      {comments.length === 0 ? (
        <h1 className="text-center text-black text-3xl">
          You haven't comments anything yet
        </h1>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="p-6 sm:p-12 mt-6 bg-[#f1f1f1] dark:text-gray-100">
              <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
                <img
                  src={comment.user.profileImgURL}
                  alt=""
                  className="self-center flex-shrink-0 w-24 h-24 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700"
                />
                <div className="flex flex-col">
                  <h4 className="text-lg text-black font-semibold lg:text-left md:text-left">
                    {comment.user.username}
                  </h4>
                  <p className="dark:text-black lg:mt-0 mt-2">
                    {comment.content}
                  </p>
                  <p className="dark:text-black flex justify-start items-center">
                    <ClockIcon className="w-4 mr-1 h-4" />{" "}
                    {formatTimeDifference(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentUser;
