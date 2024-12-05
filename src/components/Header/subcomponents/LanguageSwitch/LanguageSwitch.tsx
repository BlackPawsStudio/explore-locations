import { Menu } from "@headlessui/react";
import clsx from "clsx";
import ReactCountryFlag from "react-country-flag";

const languages = [
  {
    name: "EN",
    img: (
      <ReactCountryFlag
        countryCode={"US"}
        svg
        className="h-5 w-7 shadow-[0_0_2px_2px_lightgrey]"
      />
    ),
  },
];

export const LanguageSwitch = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button>
        {({ open }) => (
          <div className="flex items-center gap-2">
            <p>EN</p>
            <ReactCountryFlag
              countryCode={"US"}
              className="h-5 w-7 border-2 shadow-[0_0_2px_2px_lightgray]"
              svg
            />
            <div
              className={clsx(
                "ml-1 h-2 w-2 rotate-45 border-2 border-transparent border-b-grayColor border-r-grayColor transition-all",
                open && "rotate-[225deg]"
              )}
            />
          </div>
        )}
      </Menu.Button>
      <Menu.Items className={"absolute"}>
        {languages.map((item, idx) => (
          <Menu.Item key={idx}>
            <div>{item.name}</div>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};
