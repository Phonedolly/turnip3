"use client";

import AppIcon from "./AppIcon";
import DropDownIcon from "@/components/DropDownIcon";
import SearchIcon from "@/components/SerachIcon";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Link from "next/link";

const IconAndName = () => {
  return (
    <Link href="/" className="relative flex flex-row items-center justify-between gap-0.5">
      <AppIcon className="h-6 w-6 sm:h-8 sm:w-8" />
      <h1 className={`select-none text-xl font-bold font-outfit sm:text-2xl`}>
        {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
    </Link>
  );
};

const CategoryDropdown = (props: { categories: string[] }) => {
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);

  return (
    <div className="itmes-center relative flex flex-col">
      <div className="flex select-none flex-row items-center">
        <h1 className={`hidden text-lg font-outfit`}>More</h1>
        <DropDownIcon
          className={`relative h-9 w-9 sm:h-11 sm:w-11 cursor-pointer ${isOpenCategory === true
            ? `rotate-180 rounded-full bg-neutral-200`
            : ``
            }`}
          onClick={() => setIsOpenCategory(!isOpenCategory)}
        />
        <SearchIcon
          className="h-9 w-9 cursor-pointer p-1.5 sm:h-11 sm:w-11"
          onClick={() => { }}
        />
      </div>
      {isOpenCategory === true ? (
        <span className="absolute -right-2.5 top-12 w-auto">
          <div className="cursor-pointer rounded-lg bg-white text-center text-xs text-neutral-700 shadow-[0px_1.8px_10px_2.5px_rgba(0,0,0,0.105)] backdrop-blur-xl">
            {props.categories.map((category) => (
              <div
                className="flex w-full flex-row items-center justify-center px-8 py-2.5 first:rounded-t-lg last:rounded-b-lg hover:bg-neutral-50"
                key={uuidv4()}
              >
                <h1 className="hover: select-none whitespace-pre text-base font-bold">
                  {category}
                </h1>
              </div>
            ))}
          </div>
        </span>
      ) : null}
    </div>
  );
};

const Header = (props: { categories: string[] }) => {
  return (
    <div className="sticky top-4 z-50 flex h-14 w-11/12 flex-row items-center justify-between rounded-2xl bg-white/60 px-3 shadow-[0px_2.5px_5px_3px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:h-16 sm:px-4">
      <IconAndName />
      <CategoryDropdown categories={props.categories} />
    </div>
  );
};

export default Header;
