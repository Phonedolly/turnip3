'use client';

import { signIn, signOut, } from "next-auth/react";
export default function SignOut() {
  return (
    <div className="flex flex-col items-center justify-center py-2 hover:bg-purple-500 p-5 hover:text-white cursor-pointer">
      <h1 className="font-outfit font-bold text-2xl leading-relaxed text-center " onClick={() => signOut({ callbackUrl: '/', })}>Logout?</h1>
    </div>
  )
}