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

export interface BlogFormData {
  title?: string;
  category?: string;
  image?: string;
  content?: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  slug: string;
  authorId: string;
  image: string;
  updatedAt: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  likes: User[];
  numberOfLikes: number;
  createdAt: string;
  updatedAt: string;
  post: Post;
}
