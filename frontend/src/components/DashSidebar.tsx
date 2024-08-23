import { useEffect, useState } from "react";
import { CustomFlowbiteTheme, Flowbite, Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import { UserAtomState } from "../config";

const customTheme: CustomFlowbiteTheme = {
  sidebar: {
    item: {
      base: "hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 dark:text-white",
      active: "bg-gray-300 dark:bg-gray-700",
    },
  },
};

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState<UserAtomState>(userAtom);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      setUser((prev) => ({
        ...prev,
        currentUser: null,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                icon={HiUser}
                label="User"
                labelColor="dark"
                active={tab === "profile"}
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
            <Link to={"/dashboard?tab=comments"}>
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </Flowbite>
  );
}
