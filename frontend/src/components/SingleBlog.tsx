import { Blog } from "../hooks";
import { Avatar } from "./BlogCard";

export const SingleBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="grid px-10 w-full grid-cols-12 max-w-screen-2xl pt-12">
          <div className="col-span-9 pr-5">
            <div className="border-b">
              <div className="text-5xl font-extrabold">{blog.title}</div>
              <div className="text-slate-500 pt-6 pb-3">
                Posted on 24th March 2024
              </div>
            </div>
            <div
              className="pt-6"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
          <div className="col-span-3 h-screen pl-4">
            <span className="text-lg text-slate-600">Author</span>
            <div className="pt-2 flex">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar name={blog.author.name} size="big" />
              </div>
              <div className="">
                <div className="text-2xl font-bold capitalize">
                  {blog.author.name}
                </div>
                <div className="text-slate-500">
                  Random catch phrase of the author to attract the attention of
                  the reader.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
