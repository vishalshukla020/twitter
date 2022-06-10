import type { NextPage } from "next";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  DocumentData,
} from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../atoms/modalAtom";
import Modal from "../../components/Modal";
import Sidebar from "../../components/Sidebar";
// import Widgets from "../../components/Widgets";
import Post from "../../components/Post";
import { db } from "../../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
// import Comment from "../../components/Comment";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Login from "../../components/Login";
import Comment from "../../components/Comment";
import Widgets from "../../components/Widgets";

interface Props {
  trendingResults: Trending[];
  followResults: Follow[];
  providers?: any;
}

const PostPage: NextPage<Props> = ({
  trendingResults,
  followResults,
  providers,
}) => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useRecoilState<boolean>(modalState);
  const [post, setPost] = useState<DocumentData>();
  const [comments, setComments] = useState<DocumentData[]>([]);

  const router = useRouter();
  const { post_id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", post_id as string), (snapshot) => {
        setPost(snapshot.data());
      }),
    [post_id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", post_id as string, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [post_id]
  );

  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>
          {post?.username} on Twitter: `&quot;`{post?.text}`&quot;`
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-[#4a4a4a8d] max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-[#4a4a4a8d] text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hover-animation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Tweet
          </div>

          <Post id={post_id as string} post={post} postPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );

  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
};

interface Trending {
  heading: string;
  description: string;
  img: URL;
  tags: string[];
}

interface Follow {
  userImg: URL;
  username: string;
  tag: string;
}

export default PostPage;
