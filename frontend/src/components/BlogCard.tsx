import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-4 max-w-3xl w-screen cursor-pointer ">
        <div className="flex items-center">
          <Avatar size="small" name={authorName} />
          <div className="font-extralight pl-2 capitalize">{authorName}</div>
          <div className="flex flex-col justify-center pl-2">
            <Circle />
          </div>
          <div className="pl-2 font-thin text-slate-500">{publishedDate}</div>
        </div>
        <div className="text-2xl font-semibold pt-2">{title}</div>
        <div className="text-md font-thin">{content.slice(0, 100) + "..."}</div>
        <div className="font-thin text-sm text-slate-500 pt-4">{`${Math.ceil(
          content.length / 100
        )} minute(s)`}</div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="rounded-full w-1 h-1 bg-slate-500"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 ${
        size === "small" ? "w-7 h-7" : "w-10 h-10"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-sm" : "text-md"
        } text-gray-600 dark:text-gray-300 capitalize`}
      >
        {name[0]}
      </span>
    </div>
  );
}
