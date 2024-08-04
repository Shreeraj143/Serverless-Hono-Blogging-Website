import { atom } from "recoil";
import { UserAtomState } from "../config";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userAtom = atom<UserAtomState>({
  key: "userInfoAtom",
  default: {
    currentUser: null,
    loading: false,
    error: null,
  },
  effects_UNSTABLE: [persistAtom],
});
