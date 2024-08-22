import { Link } from "react-router-dom";
import { Blog } from "../hooks";
import { Button } from "flowbite-react";
import CommentSection from "./CommentSection";
import PostCardBox from "./PostCardBox";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import PostCardBoxSkeleton from "./PostCardBoxSkeleton";

export const SingleBlog = ({ post }: { post: Blog }) => {
  const [recentPosts, setRecentPosts] = useState<Blog[] | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/bulk?limit=3`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = response.data;

        if (response.status === 200) {
          setRecentPosts(data.posts);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content overflow-scroll"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <CommentSection postId={post.id} />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-gray-200">
          Recent Blogs
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts ? (
            recentPosts?.map((post) => (
              <PostCardBox key={post.id} post={post} />
            ))
          ) : (
            <>
              <PostCardBoxSkeleton />
              <PostCardBoxSkeleton />
              <PostCardBoxSkeleton />
            </>
          )}
        </div>
      </div>
    </main>
  );
};
