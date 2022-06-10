/* eslint-disable @next/next/no-img-element */

import React from "react";
import Image from "next/image";
import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";

import SidebarLink from "./SidebarLink";

const Sidebar: React.FC = () => {
  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed f-full">
      <div className="flex items-center justify-center w-14 h-14 hover-animation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30} alt="logo" />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} active={true} />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-[#d9d9d9] w-56 h-[52px] rounded-full text-lg font-bold shadow-md hover:bg-[#1a8cda]">
        Tweet
      </button>
    </div>
  );
};

export default Sidebar;
