import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const BlogDetailSkeleton = () => {
  return (
    <div className="container mx-auto xl:px-60 lg:px-30 mt-10 lg:pb-32 lg:mb-20">
      <div className="row lg:px-3 px-4">
        <div className="blog_detail flex justify-center items-center flex-col gap-4">
          {/* Title */}
          <div className="img w-full mt-5">
            <Skeleton height={20} count={3} width="100%" />
          </div>
          {/* Image */}
          <div className="img w-full mt-5">
            <Skeleton height={300} width="100%" />
          </div>

          {/* Author Info */}
          <footer className="flex w-full items-center justify-between leading-none mt-3 lg:mt-0 p-0 md:py-4">
            <a className="flex items-center no-underline text-black" href="#">
              <Skeleton circle height={64} width={64} />
              <div className="flex justify-center items-start flex-col gap-2 lg:gap-0 ml-2">
                <p className="lg:text-lg font-semibold text-md lg:w-44 w-36">
                  <Skeleton height={20} count={1} />
                  <span className="text-grey-darker lg:text-lg text-md">
                    <Skeleton height={20} />
                  </span>
                </p>
              </div>
            </a>
            <div className="heart flex justify-between lg:gap-2 gap-1 items-center">
              <a
                className="no-underline flex items-center flex-col text-grey-darker hover:text-red-dark"
                href="#"
              >
                <Skeleton circle height={30} width={30} />
                <span className="mt-1">Like</span>
              </a>
              <a
                className="no-underline flex items-center flex-col text-grey-darker hover:text-red-dark"
                href="#comment"
              >
                <Skeleton circle height={30} width={30} />
                <span className="mt-1">Comments</span>
              </a>
            </div>
          </footer>

          {/* Description */}
          <div className="desc mt-3 text-xl text-black text-justify w-full">
            <Skeleton count={10} height={10} />
          </div>
        </div>

        {/* Comment Section */}
        <div className="img w-full mt-5">
          <Skeleton height={150} width="100%" />
        </div>
        <a className="flex items-center mt-10 no-underline text-black" href="#">
          <Skeleton circle height={64} width={64} />
          <div className="flex justify-center w-full items-start flex-col gap-2 lg:gap-0 ml-2">
            <p className="ml-2 lg:text-lg font-semibold text-md w-full ">
              <Skeleton height={20} count={1} width={100} />
              <span className="text-grey-darker lg:text-lg text-md">
                <Skeleton height={20} width={100} />
              </span>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;
