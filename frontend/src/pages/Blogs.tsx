import { BlogCard } from "../components/BlogCard";
import { Appbar } from "./Appbar";
import { useBlogs } from "../hooks/useBlogs";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return <div className="">Loading...</div>;
  }
  return (
    <>
      <Appbar />
      <div className="flex justify-center">
        <div className="">
          {blogs.length === 0 ? (
            <div className="">No blogs available</div>
          ) : (
            blogs.map((blog) => (
              <BlogCard
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={"22nd April 2024"}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
