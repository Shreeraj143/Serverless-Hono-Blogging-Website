import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import { Home } from "./pages/Home";
import { Appbar } from "./components/Appbar";
import About from "./pages/About";
import FooterComponent from "./components/FooterComponent";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { UpdatePost } from "./pages/UpdatePost";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Appbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/post/:postSlug" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
