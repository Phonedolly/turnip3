'use client';

import { signIn, signOut, } from "next-auth/react";
export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 hover:bg-red-500 p-5 hover:text-white cursor-pointer">
      <h1 className="font-outfit font-bold text-6xl leading-relaxed text-center " onClick={() => signIn("cognito")}>Opps!<br />You need permission escalation.</h1>
    </div>
  )
}