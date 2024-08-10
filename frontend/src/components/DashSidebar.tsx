import { useEffect, useState } from "react";
import { CustomFlowbiteTheme, Flowbite, Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import { UserAtomState } from "../config";

const customTheme: CustomFlowbiteTheme = {
  sidebar: {
    item: {
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
    if (tabFromUrl === "profile") {
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
      <Sidebar>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
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
