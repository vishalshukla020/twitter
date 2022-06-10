/* eslint-disable @next/next/no-img-element */

import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  DocumentData,
} from "@firebase/firestore";

import { modalState, postIdState } from "../atoms/modalAtom";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { db } from "../firebase";
import Moment from "react-moment";

const Modal: React.FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState<boolean>(modalState);
  const [postId, setPostId] = useRecoilState<string>(postIdState);

  const [post, setPost] = useState<DocumentData>();

  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [postId]
  );

  const sendComment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: session?.user.name,
      tag: session?.user.tag,
      userImg: session?.user.image,
      timestamp: serverTimestamp(),
    }).then(() => {
      setIsOpen(false);
      setComment("");
    });

    router.push(`/posts/${postId}`);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-800 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    <div className="flex items-center px-1.5 py-2  border-b-2 border-gray-700">
                      <div
                        className="hover-animation w-9 h-9 flex items-center justify-center xl:px-0"
                        onClick={() => setIsOpen(false)}
                      >
                        <XIcon className="h-[22px] text-white" />
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                    <div className="w-full">
                      <div className="text-[#6e767d] flex gap-x-3 relative">
                        <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                        <img
                          src={post?.userImg}
                          alt=""
                          className="h-11 w-11 rounded-full"
                        />
                        <div>
                          <div className="inline-block group">
                            <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                              {post?.username}
                            </h4>
                            <span className="ml-1.5 text-sm sm:text-[15px]">
                              @{post?.tag}{" "}
                            </span>
                          </div>{" "}
                          ·{" "}
                          <span className="hover:underline text-sm sm:text-[15px]">
                            <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                          </span>
                          <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                            {post?.text}
                          </p>
                        </div>
                      </div>

                      <div className="mt-7 flex space-x-3 w-full">
                        <img
                          src={session?.user.image!}
                          alt=""
                          className="h-11 w-11 rounded-full"
                        />
                        <div className="flex-grow mt-2">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tweet your reply"
                            rows={2}
                            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                          />

                          <div className="flex items-center justify-between pt-2.5">
                            <div className="flex items-center">
                              <div className="icon">
                                <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
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
                              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                              type="submit"
                              onClick={(e) => sendComment(e)}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
