import { SignupInput } from "@shreeraj1811/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL, UserAtomState } from "../config";
import { Alert, Button } from "flowbite-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import { ImSpinner9 } from "react-icons/im";
import OAuth from "./OAuth";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  // const [errorMessage, setErrorMessage] = useState("");
  // const [loading, setLoading] = useState(false);
  const userInfo = useRecoilValue<UserAtomState>(userAtom);
  const setUserInfo = useSetRecoilState<UserAtomState>(userAtom);
  const [postInputs, setPostInputs] = useState<SignupInput>({
    email: "",
    password: "",
    username: "",
  });

  // Used to check the Recoil State updates
  // useEffect(() => {
  //   console.log("UserInfo state updated:", userInfo);
  // }, [userInfo]);

  const sendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      type === "signup"
        ? !postInputs.username || !postInputs.email || !postInputs.password
        : !postInputs.email || !postInputs.password
    ) {
      setUserInfo((prev: UserAtomState) => ({
        ...prev,
        error: "Please fill out all fields.",
      }));
      return;
    }

    try {
      setUserInfo((prev: UserAtomState) => ({
        ...prev,
        error: "",
        loading: true,
      }));

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      console.log(response);

      if (response.data.success === false) {
        setUserInfo((prev: UserAtomState) => ({
          ...prev,
          error: response.data.message,
          loading: false,
        }));
        return;
      }

      const jwt = response.data.jwt;
      localStorage.setItem("token", jwt);

      type === "signin"
        ? setUserInfo((prev: UserAtomState) => ({
            ...prev,
            currentUser: response.data.user,
          }))
        : null;

      setUserInfo((prev: UserAtomState) => ({
        ...prev,
        loading: false,
      }));

      type === "signup" ? navigate("/signin") : navigate("/");
    } catch (error: any) {
      console.log(error);
      // setErrorMessage(error.message);
      // setLoading(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";

      setUserInfo((prev: UserAtomState) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h1 className="text-4xl font-bold">
        {type === "signup" ? "Create an account" : "Login to your account"}
      </h1>
      <p className="mt-2 text-slate-500 font-light text-lg">
        {type === "signup"
          ? "Already have an account?"
          : "Don't have an account"}{" "}
        <Link
          className=" underline text-blue-500"
          to={type === "signup" ? "/signin" : "/signup"}
        >
          {type === "signup" ? "Sign In" : "Sign Up"}
        </Link>
      </p>
      <div className="flex flex-col gap-4 mt-8 w-8/12">
        {type === "signup" ? (
          <LabelledInput
            label="Username"
            placeholder="Enter your Username"
            onChange={(e) => {
              setPostInputs((postInput) => ({
                ...postInput,
                username: e.target.value,
              }));
            }}
          />
        ) : (
          ""
        )}
        <LabelledInput
          label="Email"
          placeholder="Enter your email"
          onChange={(e) => {
            setPostInputs((postInput) => ({
              ...postInput,
              email: e.target.value,
            }));
          }}
        />
        <LabelledInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          onChange={(e) => {
            setPostInputs((postInput) => ({
              ...postInput,
              password: e.target.value,
            }));
          }}
        />
        <Button
          onClick={sendRequest}
          disabled={userInfo.loading}
          color={"dark"}
          size={"lg"}
          className="my-3"
        >
          {userInfo.loading ? (
            <div className="flex items-center">
              <ImSpinner9 className="animate-spin text-lg" />
              <span className="pl-3">Loading...</span>
            </div>
          ) : type === "signup" ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </Button>
        <OAuth />
        {userInfo.error && (
          <Alert className="mt-5 w-full bg-red-200 text-red-600">
            {userInfo.error}
          </Alert>
        )}
      </div>
    </div>
  );
};

interface LabelledInputType {
  placeholder: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const LabelledInput = ({
  placeholder,
  label,
  onChange,
  type,
}: LabelledInputType) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 ">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
};
