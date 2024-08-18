import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useParams } from "react-router-dom";

export interface Blog {
  title: string;
  content: string;
  id: string;
  category: string;
  image: string;
  createdAt: string;
  updateAt: string;
  author: {
    username: string;
  };
}

export const useBlog = ({ postSlug }: { postSlug: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState<Blog>();

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/blog/bulk?slug=${postSlug}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.data;
      if (response.status === 200) {
        setBlog(data.posts[0]);
        setError(null);
      }

      if (response.status !== 200) {
        setError(data.message);
      }
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [postSlug]);
  return { loading, blog, error };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const blogs = await response.data.posts;
      setBlogs(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  return { loading, blogs };
};
