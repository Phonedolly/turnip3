"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/writer")) return null;
  return (
    <div className="flex items-center justify-center">
      <p className="font-outfit text-sm text-neutral-500">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
      </p>
    </div>
  );
};

export default Footer;
