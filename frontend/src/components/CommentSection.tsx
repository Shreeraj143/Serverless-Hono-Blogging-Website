import {
  Alert,
  Button,
  CustomFlowbiteTheme,
  Flowbite,
  Textarea,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import axios from "axios";
import { BACKEND_URL, Comment as CommentType } from "../config";
import Comment from "./Comment";

export default function CommentSection({ postId }: { postId: string }) {
  const userInfo = useRecoilValue(userAtom);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentError, setCommentError] = useState(null);

  const customTheme: CustomFlowbiteTheme = {
    button: {
      color: {
        blue: "border border-transparent bg-blue-500 text-white focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-500 dark:focus:ring-blue-500",
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.length > 300) {
      return;
    }
    setCommentError(null);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/comment/create`,
        { content: comment, postId, authorId: userInfo.currentUser?.id },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        setComment("");
        setCommentError(null);
      }
    } catch (error: any) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/comment/getPostComments/${postId}`
        );
        if (response.status === 200) {
          const data = await response.data;
          setComments(data);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleEdit = async (comment: CommentType, editedContent: string) => {
    setComments(
      comments.map((c) =>
        c.id === comment.id ? { ...c, content: editedContent } : c
      )
    );
  };

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className="max-w-2xl mx-auto w-full p-3">
        {userInfo.currentUser ? (
          <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <img
              className="h-5 w-5 object-cover rounded-full"
              src={userInfo.currentUser.profilePicture}
              alt=""
            />
            <Link
              to={"/dashboard?tab=profile"}
              className="text-xs text-blue-500 hover:underline"
            >
              @{userInfo.currentUser.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-blue-500 my-5 flex gap-1">
            You must be signed in to comment.
            <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
              Sign In
            </Link>
          </div>
        )}
        {userInfo.currentUser && (
          <form
            onSubmit={handleSubmit}
            className="border border-blue-500 rounded-md p-3"
          >
            <Textarea
              placeholder="Add a comment..."
              rows={parseInt("3")}
              maxLength={parseInt("300")}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-xs">
                {300 - comment.length} characters remaining
              </p>
              <Button outline color={"blue"} type="submit">
                Submit
              </Button>
            </div>
            {commentError && (
              <Alert color="failure" className="mt-5">
                {commentError}
              </Alert>
            )}
          </form>
        )}
        {comments.length === 0 ? (
          <p className="text-sm my-5">No comments yet!</p>
        ) : (
          <>
            <div className="text-sm my-5 flex items-center gap-1">
              <p>Comments</p>
              <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p>{comments.length}</p>
              </div>
            </div>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} onEdit={handleEdit} />
            ))}
          </>
        )}
      </div>
    </Flowbite>
  );
}
