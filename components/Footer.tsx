"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/writer")) return null;
  return (
    <footer className="flex h-full w-full items-center justify-center">
      <p className="sm:text-md py-4 font-outfit text-sm text-neutral-500 sm:py-6 md:py-8 md:text-lg lg:py-10 lg:text-xl xl:py-12 xl:text-2xl">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
      </p>
    </footer>
  );
};

export default Footer;
