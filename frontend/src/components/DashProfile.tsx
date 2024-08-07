import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import { Button, TextInput } from "flowbite-react";

export default function DashProfile() {
  const user = useRecoilValue(userAtom);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-3xl font-semibold text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="h-32 w-32 self-center cursor-pointer shadow-md rounded-full">
          <img
            src={user.currentUser?.profilePicture}
            className="rounded-full border-8 border-[lightgray] w-full"
            alt="Profile Picture"
          />
        </div>
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
