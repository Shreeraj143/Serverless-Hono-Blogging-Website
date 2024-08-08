import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadFile(imageFile);
    }
  }, [imageFile]);

  const uploadFile = async (file: File) => {
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
        // console.log(imageFileUploadError, imageFile, imageFileUrl);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-3xl font-semibold text-center">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={user.currentUser?.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />
        <Button color={"dark"} type="submit">
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-500 mt-5">
        <div className="cursor-pointer">Delete Account</div>
        <div className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
}
