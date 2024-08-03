import { atom } from "recoil";
import { UserAtomState } from "../config";

export const userAtom = atom<UserAtomState>({
  key: "userInfoAtom",
  default: {
    currentUser: null,
    loading: false,
    error: null,
  },
});
