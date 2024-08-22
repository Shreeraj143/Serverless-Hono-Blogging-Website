import { Link } from "react-router-dom";
import { Blog } from "../hooks";

export default function PostCardBox({ post }: { post: Blog }) {
  return (
    <>
      <div className="bg-white dark:bg-transparent shadow-lg dark:shadow dark:shadow-blue-500 rounded-lg overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
            {new Date(post.createdAt).toDateString()}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-4 italic">
            {post.category}
          </p>
          <Link to={`/post/${post.slug}`} className="text-sm font-medium">
            Read more &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
