"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectToHome = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);
  return <></>;
};

export default RedirectToHome;
