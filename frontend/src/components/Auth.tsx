import { SignupInput } from "@shreeraj1811/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Alert, Spinner } from "flowbite-react";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [postInputs, setPostInputs] = useState<SignupInput>({
    email: "",
    password: "",
    username: "",
  });

  const sendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!postInputs.username || !postInputs.email || !postInputs.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      console.log(response);

      if (response.data.success === false) {
        return setErrorMessage(response.data.message);
      }
      const jwt = response.data.jwt;
      // console.log(jwt);

      localStorage.setItem("token", jwt);
      setLoading(false);
      navigate("/signin");
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h1 className="text-4xl font-bold">Create an Account</h1>
      <p className="mt-2 text-slate-500 font-light text-lg">
        {type === "signup"
          ? "Already have an account?"
          : "Don't have an account"}{" "}
        <Link
          className=" underline"
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
        <button
          onClick={sendRequest}
          type="button"
          className="mt-4 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          {loading ? (
            <>
              <Spinner size={"sm"} />
              <span className="pl-3">Loading...</span>
            </>
          ) : type === "signup" ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </button>
        {errorMessage && (
          <Alert className="mt-5 w-full bg-red-200 text-red-600">
            {errorMessage}
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
