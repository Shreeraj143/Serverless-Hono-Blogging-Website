import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BACKEND_URL, UserAtomState } from "../config";
import axios from "axios";

export default function DashProfile() {
  const user = useRecoilValue(userAtom);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    string | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const filePickerRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({});
  const setUser = useSetRecoilState<UserAtomState>(userAtom);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(
    null
  );
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    console.log(user.currentUser);
  }, [user.currentUser]);

  useEffect(() => {
    if (imageFile) {
      uploadFile(imageFile);
    }
  }, [imageFile]);

  const uploadFile = async (file: File) => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + (imageFile?.name || "");
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log(progress);
        setImageFileUploadProgress(progress.toFixed(0));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be image and less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        // console.log(imageFileUploadError, imageFile, imageFileUrl);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    setLoading(false);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/update/${user.currentUser?.id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.data;
      console.log(data);

      if (response.status != 200) {
        setUpdateUserError(data.message);
        setLoading(false);
      } else {
        setUser((prev) => ({
          ...prev,
          currentUser: data.rest,
        }));
        setUpdateUserSuccess("User's profile updated successfully");
        setLoading(false);
      }
    } catch (error: any) {
      //   console.error("Error during update:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setUpdateUserError(
          error.response.data.message || "Something went wrong"
        );
      } else if (error.request) {
        // Request was made but no response received
        setUpdateUserError("No response from server. Please try again later.");
      } else {
        // Something else happened in setting up the request
        setUpdateUserError(error.message || "An unknown error occurred");
      }
      setLoading(false);
      //   console.log(updateUserError);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-3xl font-semibold text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="images/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          className="h-32 w-32 self-center cursor-pointer shadow-md relative rounded-full overflow-hidden"
          onClick={() => filePickerRef.current?.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={parseInt(imageFileUploadProgress) || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    parseInt(imageFileUploadProgress) / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || user.currentUser?.profilePicture || ""}
            className={`rounded-full border-8 border-[lightgray] w-full object-cover overflow-hidden h-full ${
              imageFileUploadProgress &&
              parseInt(imageFileUploadProgress) < 100 &&
              "opacity-50"
            }`}
            alt="Profile Picture"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={user.currentUser?.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={user.currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button color={"dark"} type="submit">
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-500 mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {loading && <Spinner color={"info"} className="mt-7 w-full mx-auto" />}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}
