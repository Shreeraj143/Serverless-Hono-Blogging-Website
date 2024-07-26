import { SingleBlog } from "../components/SingleBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id || "" });

  if (loading) {
    return <Spinner />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }
  return (
    <div>
      <SingleBlog blog={blog} />
    </div>
  );
};
