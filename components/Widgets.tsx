import React from "react";
import { SearchIcon } from "@heroicons/react/outline";

import Image from "next/image";
import Trending from "./Trending";

interface Props {
  trendingResults: TrendingProps[];
  followResults: FollowProps[];
}

interface TrendingProps {
  heading: string;
  description: string;
  img: URL;
  tags: string[];
}

interface FollowProps {
  userImg: URL;
  username: string;
  tag: string;
}

const Widgets: React.FC<Props> = ({ trendingResults, followResults }) => {
  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5 sticky top-0">
      <div className="py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full">
          <SearchIcon className="text-gray-500 h-5 z-50" />
          <input
            type="text"
            className="bg-[transparent] pl-6 outline-none caret-gray-700 text-white"
            placeholder="Search Twitter"
          />
        </div>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">What&apos;s happening</h4>
        {trendingResults.map((result, index) => (
          <Trending key={index} result={result} />
        ))}
        <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
          Show more
        </button>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {followResults.map((result, index) => (
          <div
            className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center"
            key={index}
          >
            <Image
              alt=""
              src={`${result?.userImg}`}
              width={50}
              height={50}
              objectFit="cover"
              className="rounded-full"
            />
            <div className="ml-4 leading-5 group">
              <h4 className="font-bold group-hover:underline">
                {result.username}
              </h4>
              <h5 className="text-gray-500 text-[15px]">{result.tag}</h5>
            </div>
            <button className="ml-auto bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
              Follow
            </button>
          </div>
        ))}
        <button className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-[#1d9bf0] font-light">
          Show more
        </button>
      </div>
    </div>
  );
};

export default Widgets;
