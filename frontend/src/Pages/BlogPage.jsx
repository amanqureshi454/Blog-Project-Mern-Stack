import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import {
  ChevronDoubleDownIcon,
  HeartIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import PostSkeleton from "../Components/Skeleton";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${window.location.origin}/getAllPost`);
        const responseData = await response.json();

        if (
          responseData.status === "success" &&
          Array.isArray(responseData.data)
        ) {
          setPosts(responseData.data);
          setIsLoading(false);
        } else {
          console.error("Invalid data structure:", responseData);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 3);
  };

  return (
    <>
      <Navbar />
      <div className="container my-12 mx-auto px-4 md:px-12">
        <h2 className="lg:text-5xl text-2xl text-black text-left py-2 lg:py-10">
          Latest Post
        </h2>
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          {/* Column */}
          {isLoading
            ? Array.from({ length: 16 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))
            : posts.slice(0, visiblePosts).map((post) => {
                const createdAtDate = new Date(post.createdAt);
                const formattedDate = createdAtDate.toLocaleDateString("en-GB");

                return (
                  <div
                    className="my-4 h-[480px] px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
                    key={post._id}
                  >
                    {/* Article */}
                    <article className="overflow-hidden rounded-lg shadow-lg">
                      <Link to={`/blogdetail/${post._id}`}>
                        <img
                          alt="Placeholder"
                          className="block h-64 w-full"
                          src={`${window.location.origin}/${post.file}`}
                        />
                      </Link>
                      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                        <h1 className="text-lg overflow-hidden line-clamp-2 h-auto whitespace-normal w-[450px]">
                          <a
                            className="no-underline hover:underline text-black font-bold font-serif"
                            href="#"
                          >
                            {post.title}
                          </a>
                        </h1>
                        <p className="text-grey-darker text-sm">
                          {formattedDate}
                        </p>
                      </header>
                      <p className="desc lg:px-4 md:px-4 px-3 overflow-hidden line-clamp-3 h-[72px]  whitespace-normal lg:w-[auto]">
                        {post.summary}
                      </p>
                      <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                        <a
                          className="flex items-center no-underline hover:underline text-black"
                          href="#"
                        >
                          <img
                            alt="Placeholder"
                            className="block rounded-full w-10 h-10"
                            src={post.author.profileImgURL}
                          />
                          <p className="ml-2 text-sm">{post.author.username}</p>
                        </a>

                        <a
                          className="no-underline text-grey-darker hover:text-red-dark"
                          href="#"
                        >
                          <span className="hidden">Like</span>
                          <HeartIcon className="w-6 h-6" />
                        </a>
                      </footer>
                    </article>
                    {/* END Article */}
                  </div>
                );
              })}

          {/* END Column */}
          {/* Column */}
        </div>
        {visiblePosts < posts.length && (
          <button
            className="bg-black text-white text-xl rounded-full w-44 p-2 m-auto flex justify-center items-center lg:mb-20 mb-10 lg:mt-10 mt-5"
            onClick={handleLoadMore}
          >
            <ChevronDoubleDownIcon className="w-6 h-6 m-1" />
            Load More
          </button>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default BlogPage;
