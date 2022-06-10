/* eslint-disable @next/next/no-img-element */

import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import React, { useRef, useState, useEffect } from "react";

//firebase imports
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from "next-auth/react";

import { db, storage } from "../firebase";

const Input: React.FC = () => {
  const { data: session, status } = useSession();

  const [input, setInput] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const sendPost = async () => {
    //handles multiple submit events
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session?.user.uid,
      username: session?.user.name,
      userImg: session?.user.image,
      tag: session?.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadUrl,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
  };

  return (
    <>
      <div
        className={`border-b border-[#4a4a4a8d] p-3 flex space-x-3 overflow-y-scroll no-scrollbar`}
      >
        {session && (
          <img
            src={session.user.image!}
            alt="profile image"
            className="h-11 w-12 rounded-full cursor-pointer"
          />
        )}
        <div className="w-full divide-y divide-[#4a4a4a8d]">
          <div
            className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
              placeholder="What's happening?"
              rows={2}
            />
          </div>
          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt="selected image to be tweeted"
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}

          {!loading && (
            <div className="flex items-center justify-between pt-2.5">
              <div className="flex items-center">
                <div
                  className="icon"
                  onClick={() => filePickerRef.current?.click()}
                >
                  <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                  <input
                    type="file"
                    ref={filePickerRef}
                    hidden
                    onChange={addImageToPost}
                  />
                </div>

                <div className="icon rotate-90">
                  <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                </div>

                <div className="icon">
                  <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                </div>

                <div className="icon">
                  <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                </div>
              </div>
              <button
                className="bg-[#1d9bf0] text-[#d9d9d9] rounded-full px-4 pt-1.5 pb-2 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-60 disabled:cursor-default"
                disabled={!input && !selectedFile}
                onClick={sendPost}
              >
                Tweet
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Input;
