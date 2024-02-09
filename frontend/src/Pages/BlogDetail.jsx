import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { Link, useParams } from "react-router-dom";
import { HeartIcon, PencilIcon } from "@heroicons/react/24/outline";
import Comment from "../Components/Comment";
import BlogDetailSkeleton from "../Components/BlogDetailSkeleton";
import Swal from "sweetalert2/dist/sweetalert2.js";

const BlogDetail = () => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);

  const { id } = useParams();
  // console.log(id);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET POST BY ID
        const response = await fetch(`${window.location.origin}/getPost/${id}`);
        const responseData = await response.json();
        if (response.ok) {
          setPost(responseData.data);
          // console.log(responseData.data.author);
          setIsLoading(false);
          // console.log(responseData.data);
        }

        const userResponse = await fetch(`${window.location.origin}/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
          },
        });
        const getUserData = await userResponse.json();
        setUser(getUserData.data);
        // console.log(getUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, comment]);

  const onCommentHandler = async (e) => {
    e.preventDefault();

    try {
     
      const commentSend = await fetch(
        `${window.location.origin}/postComment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment,
          }),
        }
      );
      console.log(comment);

      if (!commentSend.ok) {
        // Handle non-successful response (e.g., display an error message)
        const errorMessage = await commentSend.text(); // Get the error message from the response body
        console.error(
          `Failed to post comment. Status: ${commentSend.status}. Error: ${errorMessage}`
        );
        return;
      }

      const commentPost = await commentSend.json();

      // Display SweetAlert when comment is successfully added
      Swal.fire({
        position: "top-center",
        background: "#000",
        color: "#fff",
        icon: "success",
        title: "Comment Added",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "dark-mode", // Apply a class for dark mode styling
          content: "dark-mode-content", // Additional class for content if needed
        },
      });

      // Update state with the new comment
      setPost((prevPost) => ({ ...prevPost, newComment: commentPost.data }));

      // Clear the comment input
      setComment("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

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
  const formattedTime = createdAtDate.toLocaleTimeString("en-US", timeOptions);

  const finalFormattedDate = `${formattedDate} ${formattedTime.toLowerCase()}`;

  return (
    <>
      <Navbar />
      {isLoading ? (
        <BlogDetailSkeleton />
      ) : (
        <div className="container mx-auto xl:px-60 lg:px-30 mt-10 lg:pb-32 lg:mb-20">
          <div className="row lg:px-3 px-4">
            <div className="blog_detail flex justify-center items-center flex-col gap-4">
              <h1 className="lg:text-6xl text-black lg:text-center text-left text-3xl">
                {post.title}
              </h1>
              {/* <p className="text-lg text-gray-400">Time Stanp 12:220::00</p>
            <h6 className="text-xl text-black font-bold">by Author Name</h6> */}
              {post.author._id === user.id ? (
                <Link to={`/editpost/${id}`}>
                  {" "}
                  {/* Adjust the edit post route as needed */}
                  <button className="py-3 px-4 flex justify-center items-center w-max bg-black text-white rounded-lg hover:opacity-90 hover:bg-gray-800">
                    <PencilIcon fontSize={3} className="w-4 h-4 mr-2" />
                    Edit Your Post
                  </button>
                </Link>
              ) : (
                ""
              )}
              <div className="img w-full mt-5">
                <img
                  className="lg:h-[300px] sm:h-80 w-full object-cover"
                  src={`${window.location.origin}/${post.file}`}
                  alt=""
                />
              </div>

              <footer className="flex w-full items-center justify-between leading-none mt-3 lg:mt-0 p-0 md:py-4">
                <a
                  className="flex items-center no-underline  text-black"
                  href="#"
                >
                  <img
                    alt="Placeholder"
                    className="block rounded-full lg:w-16 lg:h-16 w-12 h-12"
                    src={post.author.profileImgURL}
                  />
                  <div className="flex justify-center items-start flex-col gap-2 lg:gap-0  ml-2">
                    <p className="lg:text-lg text:md ml-2">
                      {post.author.username}
                    </p>
                    <p className="ml-2 lg:text-lg font-semibold text:md">
                      Publish at {""}
                      <span className="text-grey-darker lg:text-lg text:md ">
                        {finalFormattedDate}
                      </span>
                    </p>
                  </div>
                </a>
                <div className="heart flex justify-between gap-4 items-center">
                  <a
                    className="no-underline flex items-center flex-col  text-grey-darker hover:text-red-dark"
                    href="#"
                  >
                    <HeartIcon className="w-6 h-6" />
                    <span className="mt-1">Like</span>
                  </a>
                  <a
                    className="no-underline flex items-center flex-col  text-grey-darker hover:text-red-dark"
                    href="#comment"
                  >
                    <PencilIcon className="w-6 h-6" />
                    <span className="mt-1">Comments</span>
                  </a>
                </div>
              </footer>
              {/* </div> */}
              <div
                className="desc mt-3 text-xl text-black text-justify"
                dangerouslySetInnerHTML={{ __html: post.description }}
              ></div>
            </div>
            <div className="comment-con mt-10">
              <h2 className="lg:text-xl mb-3 font-bold text:md cursor-pointer">
                <PencilIcon className="w-5 h-5 inline mr-1" id="comment" />{" "}
                Write a Comment
              </h2>

              <form onSubmit={onCommentHandler} className="mb-10">
                <textarea
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  id=""
                  placeholder="Leave a Comment"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5  bg-[#f1f1f1] dark:border-gray-300 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white dark:focus:border-white"
                  rows="5"
                ></textarea>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#434343] to-[#434343] text-white rounded-3xl w-44 mt-5 border-none px-3 lg:px-4 py-3 hover:bg-slate-600  "
                >
                  Send A comment
                </button>
              </form>

              <Comment />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogDetail;
