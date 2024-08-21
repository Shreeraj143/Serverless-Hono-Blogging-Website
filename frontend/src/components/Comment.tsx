import { useEffect, useState } from "react";
import { BACKEND_URL, Comment as CommentType, User } from "../config";
import axios from "axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import { useNavigate } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment }: { comment: CommentType }) {
  const [user, setUser] = useState<User>();
  const userInfo = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [updatedComment, setUpdatedComment] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState<string | null>(null);

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

  const handleLike = async () => {
    try {
      if (!userInfo.currentUser) {
        navigate("/signin");
      }

      const response = await axios.put(
        `${BACKEND_URL}/api/v1/comment/likeComment/${comment.id}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);

        setUpdatedComment({
          ...updatedComment,
          likes: data.likes,
          numberOfLikes: data.likes.length,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
    setEditedContent(updatedComment.content);
  };

  const handleSave = async () => {
    if (editedContent.trim() === "") {
      // Prevent saving an empty comment
      setError("Comment content cannot be empty.");
      return;
    }
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/comment/editComment/${comment.id}`,
        { content: editedContent },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        setUpdatedComment({ ...updatedComment, content: editedContent });
        setError(null);
      }
    } catch (error: any) {
      console.log(error.message);
      setError("Failed to update the comment. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Exit editing mode
    setEditedContent(updatedComment.content); // Reset editedContent to the original comment content
    setError(null); // Clear any error messages
  };

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
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              className="mb-2"
              onChange={(e) => {
                setEditedContent(e.target.value);
              }}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                size="xs"
                outline
                color={"blue"}
                onClick={handleSave}
                disabled={
                  editedContent === updatedComment.content ||
                  editedContent.trim() === ""
                }
              >
                Save
              </Button>
              <Button
                type="button"
                size="xs"
                outline
                color={"blue"}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center text-xs pt-2 border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                onClick={handleLike}
                className={`text-gray-400 hover:text-blue-500 ${
                  userInfo.currentUser &&
                  updatedComment.likes?.some(
                    (user) => user.id === userInfo.currentUser?.id
                  ) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="text-gray-400">
                {updatedComment.numberOfLikes > 0 &&
                  updatedComment.numberOfLikes +
                    " " +
                    (updatedComment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {userInfo.currentUser &&
                userInfo.currentUser.id === comment.authorId && (
                  <button
                    className="text-gray-400 hover:text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
