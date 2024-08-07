import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const user = useRecoilValue(userAtom);
  return user.currentUser ? <Outlet /> : <Navigate to={"/signin"} />;
}
