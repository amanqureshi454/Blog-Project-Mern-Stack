import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const PostSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#313131" highlightColor="#525252">
      <div className="my-4 h-[480px] px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <article className="overflow-hidden rounded-lg shadow-lg">
          <Skeleton height={250} width="100%" />
          <header className="flex items-center justify-between leading-tight p-2 md:p-4">
            <h1 className="text-lg overflow-hidden line-clamp-3 h-auto whitespace-normal w-[450px]">
              <Skeleton height={8} count={3} width="90%" />
            </h1>
            <p className="text-grey-darker text-sm">
              <Skeleton height={30} circle count={1} width={30} />
            </p>
          </header>
          <p className="desc lg:px-4 md:px-4 px-3 overflow-hidden line-clamp-3 h-[72px] whitespace-normal lg:w-[auto]">
            <Skeleton count={3} height={10} />
          </p>
          <footer className="flex items-center justify-between leading-none p-2 md:p-4">
            <a className="flex items-center no-underline hover:underline text-black">
              <Skeleton circle height={32} width={32} />
              <p className="ml-2 text-sm">
                <Skeleton height={15} width={80} />
              </p>
            </a>
            <a className="no-underline text-grey-darker hover:text-red-dark">
              <Skeleton height={20} count={1} width={40} />
            </a>
          </footer>
        </article>
      </div>
    </SkeletonTheme>
  );
};

export default PostSkeleton;
