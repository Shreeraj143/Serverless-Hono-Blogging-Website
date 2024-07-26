import { Link } from "react-router-dom";
import { Avatar } from "../components/BlogCard";

export const Appbar = () => {
  return (
    <div className="flex justify-between px-10 py-4 border-b items-center">
      <Link to={"/blogs"} className="">
        Medium
      </Link>
      <div className="flex mr-2">
        <Link to={"/publish"}>
          <button
            type="button"
            className="text-white mr-8 rounded-full bg-green-600 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Publish
          </button>
        </Link>
        <div className="">
          <Avatar size="big" name={"Shreeraj"} />
        </div>
      </div>
    </div>
  );
};
