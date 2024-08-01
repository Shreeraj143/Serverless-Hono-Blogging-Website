import { NavLink, useLocation } from "react-router-dom";
import { Avatar } from "../components/BlogCard";
import { Button, Navbar } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export const Appbar = () => {
  const location = useLocation().pathname;
  return (
    <Navbar className="flex md:justify-between px-4 sm:px-6 md:px-10 py-4 border-b items-center">
      <NavLink to={"/"}>Medium</NavLink>
      <div className="hidden lg:flex items-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="pr-10 py-2 border rounded-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
        <AiOutlineSearch className="absolute right-3 text-xl text-gray-500" />
      </div>
      <Button className="lg:hidden" color={"gray"}>
        <AiOutlineSearch className="text-2xl" />
      </Button>

      <div className="flex md:gap-16 lg:gap-24 items-center md:order-2">
        <div className="flex gap-5 items-center justify-between">
          <Avatar size="big" name={"Shreeraj"} />
          <div className="bg-slate-800 h-9 w-9 rounded-full flex items-center justify-center text-white">
            <FaMoon />
          </div>
        </div>
        <Navbar.Toggle className="ml-3" />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          href="/"
          active={location === "/"}
          className={
            location === "/"
              ? "text-blue-500 hover:text-blue-500"
              : "hover:text-blue-500"
          }
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          href="/about"
          active={location === "/about"}
          className={
            location === "/about"
              ? "text-blue-500 hover:text-blue-500"
              : "hover:text-blue-500"
          }
        >
          About
        </Navbar.Link>
        <Navbar.Link
          href="/publish"
          active={location === "/publish"}
          className={
            location === "/publish"
              ? "text-blue-500 hover:text-blue-500"
              : "hover:text-blue-500"
          }
        >
          Publish
        </Navbar.Link>
        <Navbar.Link
          href="/signup"
          active={location === "/signup"}
          className={
            location === "/signup"
              ? "text-blue-500 hover:text-blue-500"
              : "hover:text-blue-500"
          }
        >
          Sign Up
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
