import axios from "axios";
import { BACKEND_URL, BlogFormData } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";

export const UpdatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>();
  const [publishError, setPublishError] = useState<string | null>(null);
  const userInfo = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/bulk?postId=${postId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = response.data;

        if (response.status === 200) {
          setFormData(data.posts[0]);
          setPublishError(null);
        }
      };
      fetchPosts();
      console.log(formData);
    } catch (error: any) {
      console.log(error.message);
    }
  }, [postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    console.log(image);

    if (
      image &&
      image.size < 3 * 1024 * 1024 &&
      image.type.startsWith("image/")
    ) {
      setFile(image);
    } else {
      setImageUploadError(
        "Invalid file. Please upload an image less than 3MB."
      );
    }
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image.");
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "Could not upload image (File must be image and less than 3MB"
          );
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPublishError(null);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog/updatepost/${postId}/${userInfo.currentUser?.id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = response.data;

      if (response.status != 200) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <>
      {formData ? (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
          <h1 className="text-center text-3xl my-7 font-semibold">
            Update post
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                value={formData?.title}
              />
              <Select
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                value={formData?.category}
              >
                <option value="uncategorized">Select a category</option>
                <option value="javascript">JavaScript</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
                <option value="nodejs">NodeJs</option>
                <option value="entertainment">Entertainment</option>
                <option value="bollywood">Bollywood</option>
                <option value="sports">Sports</option>
                <option value="web-development">Web Development</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
              </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
              <FileInput accept="image/*" onChange={handleImageChange} />
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={handleUploadImage}
                disabled={imageUploadProgress !== null}
                outline
              >
                {imageUploadProgress ? (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={+imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {formData?.image && (
              <img
                src={formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
              />
            )}
            <ReactQuill
              theme="snow"
              value={formData?.content}
              placeholder="Write something..."
              className="h-72 mb-12"
              onChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
            />
            <Button type="submit" color={"blue"}>
              Update Post
            </Button>
            {publishError && (
              <Alert className="my-5" color={"failure"}>
                {publishError}
              </Alert>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full flex min-h-screen items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}
    </>
  );
};
