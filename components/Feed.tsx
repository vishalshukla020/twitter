import React, { useState, useEffect } from "react";
import { LogoutIcon } from "@heroicons/react/outline";
import { signOut } from "next-auth/react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "@firebase/firestore";

import { db } from "../firebase";

import Input from "./Input";
import Post from "./Post";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );

  return (
    <div className="text-[#d9d9d9] flex-grow border-l border-r border-[#4a4a4a8d] max-w-2xl sm:ml-[73px] xl:ml-[370px] ">
      <div className="text-[#d9d9d9] flex items-center py-2 px-3 sticky top-0 z-50  border-b border-[#4a4a4a8d] bg-black">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hover-animation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <LogoutIcon className="h-5 text-white" onClick={() => signOut()} />
        </div>
      </div>
      <Input />
      <div className="pb-72">
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
