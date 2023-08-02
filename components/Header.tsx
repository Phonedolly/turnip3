"use client";

import AppIcon from "./icons/AppIcon";
import DropDownIcon from "@/components/icons/DropDownIcon";
import SearchIcon from "@/components/icons/SerachIcon";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconAndName = () => {
  return (
    <Link
      href="/"
      className="relative flex flex-row items-center justify-between gap-1"
    >
      <AppIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
      <h1
        className={`select-none font-outfit text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl `}
      >
        {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
    </Link>
  );
};

const CategoryDropdown = (props: { categories: string[] }) => {
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);

  return (
    <div className="itmes-center relative flex flex-col lg:hidden">
      <div className="flex select-none flex-row items-center">
        <h1 className={`hidden font-outfit text-lg`}>More</h1>
        <DropDownIcon
          className={`relative h-9 w-9 cursor-pointer sm:h-10 sm:w-11 ${
            isOpenCategory === true
              ? `rotate-180 rounded-full bg-neutral-200`
              : ``
          }`}
          onClick={() => setIsOpenCategory(!isOpenCategory)}
        />
      </div>
      {isOpenCategory === true ? (
        <span className="absolute -right-2.5 top-12 w-auto">
          <div className="cursor-pointer rounded-lg bg-white text-center text-xs text-neutral-700 shadow-[0px_1.8px_10px_2.5px_rgba(0,0,0,0.105)] backdrop-blur-xl">
            {props.categories.map((category) => (
              <Link
                href={`/category/${category}`}
                className="flex w-full flex-row items-center justify-center px-8 py-2.5 first:rounded-t-lg last:rounded-b-lg hover:bg-neutral-50"
                key={uuidv4()}
                onClick={() => setIsOpenCategory(false)}
              >
                <h1 className="hover: select-none whitespace-pre text-base font-bold">
                  {category}
                </h1>
              </Link>
            ))}
          </div>
        </span>
      ) : null}
    </div>
  );
};

const Header = (props: { categories: string[] }) => {
  const pathname = usePathname();

  if (pathname?.startsWith("/writer")) {
    return null;
  }
  return (
    <header
      className={`top-6 z-50 flex h-14 w-full flex-row items-center justify-between rounded-2xl bg-white/60 px-3 shadow-[0px_2.5px_16px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:top-8 sm:h-16 sm:px-3 md:top-10 md:h-24 md:max-w-4xl md:px-4 lg:top-12 lg:max-w-5xl lg:px-5 xl:max-w-6xl ${
        pathname?.includes("/post") || pathname?.includes("/deploy")
          ? `relative`
          : `sticky`
      }`}
    >
      <IconAndName />
      <div className="flex flex-row items-center sm:gap-x-2 lg:gap-x-4">
        <div className="hidden flex-row items-center gap-x-6 rounded-xl px-6 py-4 lg:visible lg:flex">
          {props.categories.map((category) => (
            <Link
              href={`/category/${category}`}
              className="cursor-pointer select-none rounded-md px-3 py-2 font-outfit text-2xl font-bold transition hover:bg-neutral-300/60"
              key={uuidv4()}
            >
              {category}
            </Link>
          ))}
        </div>
        <CategoryDropdown categories={props.categories} />
        <SearchIcon
          className="h-9 w-9 cursor-pointer p-1.5 sm:h-11 sm:w-11"
          onClick={() => {}}
        />
      </div>
    </header>
  );
};

export default Header;
