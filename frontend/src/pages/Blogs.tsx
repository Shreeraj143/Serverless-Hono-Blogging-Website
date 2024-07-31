import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { BlogSkeleton } from "../components/BlogSkeleton";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-16">
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }
  return (
    <>
      <div className="text-5xl text-center py-5 ">All Blogs</div>
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
