import clsx from "clsx";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "~/src/assets";
import { Logo } from "../shared/Logo";

const linksInfo = [
  [
    {
      item: <Logo white className="mb-8 lg:mb-16" />,
      url: "/",
    },
    {
      item: "Blog",
      url: "#",
    },
    {
      item: "About us",
      url: "#",
    },
    {
      item: "Contact us",
      url: "#",
    },
    {
      item: "Terms of Use & Privacy",
      url: "#",
    },
  ],
  [
    {
      item: (
        <div className="mb-3 border-b-2 border-redBg py-3 font-bold">
          Explore Locations
        </div>
      ),
      url: "/",
    },
    {
      item: "Explore Airports",
      url: "/airports",
    },
    {
      item: "Driving Routes",
      url: "/driving-routes",
    },
    {
      item: "Flying Routes",
      url: "/flying-routes",
    },
  ],
  [
    {
      item: (
        <div className="mb-3 border-b-2 border-redBg py-3 font-bold">
          Social Media
        </div>
      ),
      url: "#",
    },
    {
      item: (
        <div className="flex gap-3">
          <FacebookIcon />
          <p>Facebook</p>
        </div>
      ),
      url: "#",
    },
    {
      item: (
        <div className="flex gap-3">
          <InstagramIcon />
          <p>Instagram</p>
        </div>
      ),
      url: "#",
    },
    {
      item: (
        <div className="flex gap-3">
          <TwitterIcon />
          <p>Twitter</p>
        </div>
      ),
      url: "#",
    },
  ],
];

export const Footer = () => {
  return (
    <footer className="bg-darkGrayBg">
      <div className="container mx-auto px-3 py-5 lg:px-0">
        <div className="flex flex-col gap-x-[4.5rem] border-b  border-gray-700 pb-7 lg:flex-row lg:gap-x-40 lg:pb-[3.7rem]">
          {linksInfo.map((links, index) => (
            <div key={index} className="lg:w-1/5">
              <ul className="text-white">
                {links.map((link, index) => (
                  <Link href={link.url} key={index}>
                    <li
                      className={clsx(
                        "w-full pt-3 lg:w-auto",
                        index !== links.length - 1 &&
                          index !== 0 &&
                          "border-b border-gray-700 pb-4 lg:pb-[1.35rem]"
                      )}
                    >
                      {link.item}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pb-4 pt-5 text-center text-white lg:pt-7 lg:text-lg">
          Made with ♥ in Romania & more© 2022 ExploreLocations.com.
        </div>
      </div>
    </footer>
  );
};
