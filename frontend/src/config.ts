// export const BACKEND_URL = "https://backend.shreerajs123.workers.dev";
export const BACKEND_URL = "http://localhost:8787";

export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAtomState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
