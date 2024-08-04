import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "flowbite-react";
import { app } from "../firebase";
import axios from "axios";
import { BACKEND_URL, UserAtomState } from "../config";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState<UserAtomState>(userAtom);
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/oauth`, {
        username: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      });

      localStorage.setItem("token", response.data.jwt);

      console.log(resultsFromGoogle);
      console.log(response);
      if (response.status === 200) {
        setUserInfo((prev: UserAtomState) => ({
          ...prev,
          currentUser: response.data.user,
        }));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button color={"dark"} size={"lg"} onClick={handleGoogleClick}>
      <div className="flex items-center">
        <FcGoogle className="mr-2 h-5 w-5" />
        Continue With Google
      </div>
    </Button>
  );
}
