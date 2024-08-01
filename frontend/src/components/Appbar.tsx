import { Link, NavLink } from "react-router-dom";
import { Avatar } from "../components/BlogCard";
import { Button } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export const Appbar = () => {
  return (
    <div className="flex justify-between px-10 py-4 border-b items-center">
      <NavLink to={"/"}>Medium</NavLink>
      <div className="hidden lg:flex items-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="pr-10 py-2 border rounded-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
        <AiOutlineSearch className="absolute right-3 text-xl text-gray-500" />
      </div>
      <div className="flex mr-20 gap-36">
        <div className="flex justify-between w-64 items-center">
          <NavLink
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            to={"/about"}
          >
            About
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            to={"/publish"}
          >
            Publish
          </NavLink>
        </div>

        <div className="flex gap-5 items-center">
          <Avatar size="big" name={"Shreeraj"} />
          <div className="bg-slate-800 h-9 w-9 rounded-full flex items-center justify-center text-white">
            <FaMoon />
          </div>
          <Button color={"gray"} size={"lg"}>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
