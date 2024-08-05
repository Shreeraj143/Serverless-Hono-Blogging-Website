import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/atoms";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useRecoilValue(themeAtom);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[#10172A] min-h-screen">
        {children}
      </div>
    </div>
  );
}
