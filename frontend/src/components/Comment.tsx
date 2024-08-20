import { useEffect, useState } from "react";
import { BACKEND_URL, Comment as CommentType, User } from "../config";
import axios from "axios";
import moment from "moment";

export default function Comment({ comment }: { comment: CommentType }) {
  const [user, setUser] = useState<User>();
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/user/${comment.authorId}`
        );
        const data = response.data;

        if (response.status === 200) {
          setUser(data.user);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment?.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
}
