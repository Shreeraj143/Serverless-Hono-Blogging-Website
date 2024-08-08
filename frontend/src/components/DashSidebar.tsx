import { useEffect, useState } from "react";
import { CustomFlowbiteTheme, Flowbite, Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl === "profile") {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
            <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </Flowbite>
  );
}
