import Link from "next/link";
import { Logo } from "../shared/Logo";
import { useRouter } from "next/router";
import { useState } from "react";
import clsx from "clsx";

export const Header = () => {
  const router = useRouter();

  const navData = [
    {
      name: "Explore Airports",
      url: "/airports",
    },
    {
      name: "Flying Routes",
      url: "/flying-routes",
    },
    {
      name: "Driving Routes",
      url: "/driving-routes",
    },
  ];
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div
      className={clsx(
        "relative z-[9999] w-full bg-white shadow-[0px_4px_4px_#00000009]",
        isOpened && "sticky top-0 bg-red-500"
      )}
    >
      <header className="container flex w-full items-center px-3 py-3 lg:h-[6.3rem] lg:py-0">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="ml-20 hidden h-full lg:block">
          <ul className="flex h-full items-center gap-[2.38rem]">
            {navData.map((item, idx) => (
              <li
                key={idx}
                className={
                  "relative flex h-full items-center text-center tracking-wider"
                }
              >
                <Link href={item.url} className="lg:whitespace-nowrap">
                  {item.name}
                </Link>
                {router.pathname.includes(
                  item.url.toLowerCase().substring(0, item.url.length - 1)
                ) && (
                  <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 rounded-[0.2rem_0.2rem_0_0] border-0 border-t-2 border-redText transition-all" />
                )}
              </li>
            ))}
            {/* Skip for now */}
            {/* <li>
              <LanguageSwitch />
            </li> */}
          </ul>
        </nav>
        <div
          className="ml-auto flex flex-col lg:hidden"
          onClick={() => setIsOpened(!isOpened)}
        >
          {new Array(3).fill(0).map((_, idx) => (
            <div
              key={idx}
              className={clsx(
                "mb-1 h-[0.2rem] w-5 rounded-lg bg-black transition-all",
                isOpened && idx === 0 && "translate-y-2 rotate-45",
                isOpened && idx === 1 && "-rotate-45",
                isOpened && idx === 2 && "opacity-0",
                isOpened && "bg-redBg"
              )}
            />
          ))}
        </div>
      </header>
      <aside
        className={clsx(
          "absolute w-full overflow-hidden bg-white shadow-[0px_4px_4px_#00000009_inset] transition-all duration-300 lg:hidden",
          isOpened ? "h-screen" : "h-0"
        )}
      >
        <ul className="mt-5 flex w-full flex-col gap-[2.38rem] font-bold">
          {navData.map((item, idx) => (
            <li
              key={idx}
              className={
                "relative flex h-full items-center px-3 text-center tracking-wider"
              }
            >
              <Link
                href={item.url}
                className="w-full whitespace-nowrap border-b-2 pb-1 text-left"
              >
                {item.name}
              </Link>
              {router.pathname.includes(
                item.url.toLowerCase().substring(0, item.url.length - 1)
              ) && (
                <div className="absolute left-0 top-1/2 h-full w-0 -translate-y-1/2 rounded-[0_0.2rem_0.2rem_0] border-0 border-r-4 border-redText transition-all" />
              )}
            </li>
          ))}
          {/* Skip for now */}
          {/* <li>
              <LanguageSwitch />
            </li> */}
        </ul>
      </aside>
    </div>
  );
};
