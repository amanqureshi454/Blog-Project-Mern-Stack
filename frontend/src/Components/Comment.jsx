import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${window.location.origin}/getComment/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        // console.log("Fetched comments:", data);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchData();
  }, [id, comments]);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return dateTime.toLocaleDateString("en-GB", options);
  };

  return (
    <div>
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="p-6 sm:p-12 mt-3 bg-[#f1f1f1] dark:text-gray-100"
        >
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
            <img
              src={comment.user?.profileImgURL}
              alt="Profile"
              className="self-center flex-shrink-0 w-24 h-24 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700"
            />
            <div className="flex flex-col">
              <h4 className="text-lg text-black font-semibold text-center md:text-left">
                {comment.user?.username}
              </h4>
              <p className="dark:text-black">{comment.content}</p>
              <p className="dark:text-black flex justify-start items-center">
                <ClockIcon className="w-4 mr-1 h-4" />{" "}
                {formatDateTime(comment.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comment;
