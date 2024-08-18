import { Alert } from "flowbite-react";
import { SingleBlog } from "../components/SingleBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

export const Blog = () => {
  const { postSlug } = useParams();
  const { loading, blog, error } = useBlog({ postSlug: postSlug || "" });

  if (loading) {
    return <Spinner />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }
  return (
    <div>
      <SingleBlog post={blog} />
      {error && <Alert color={"failure"}>{error}</Alert>}
    </div>
  );
};
