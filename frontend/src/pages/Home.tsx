import { Link } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks/";

export const Home = () => {
  const { loading, blogs } = useBlogs();

  return (
    <div className=" bg-gray-100 dark:bg-[#10172A]">
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12">
        <div className="container mx-auto text-center px-6 md:px-12">
          <h1 className="text-5xl font-bold">Welcome to Our Blog</h1>
          <p className="mt-4 text-xl">
            Discover the latest articles and insights from our authors.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-block bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Blogs</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-wrap">
            {blogs.map((blog) => (
              <BlogCard
                id={blog.id}
                key={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={"22nd April 2024"} // Example date, you should use the actual date from the blog data
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
