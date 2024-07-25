import { Avatar } from "../components/BlogCard";

export const Appbar = () => {
  return (
    <div className="flex justify-between px-10 py-4 border-b">
      <div className="">Medium</div>
      <div className="">
        <Avatar size="big" name={"Shreeraj"} />
      </div>
    </div>
  );
};
