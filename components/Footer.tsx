"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/writer")) return null;
  return (
    <footer className="flex items-center justify-center w-full h-full">
      <p className="font-outfit text-sm text-neutral-500">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
      </p>
    </footer>
  );
};

export default Footer;
