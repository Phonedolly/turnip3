import { SessionProvider, signIn, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";
import Editor from "@/components/MDXEditor";
import Writer from "@/components/Writer";
import initNewPost from "@/lib/initNewPost";

export default async function WriterWrapper() {
  const session = await getServerSession(authOptions);
  console.log(session);
  // if (!session || !session.user) {
  //   return <SignIn />
  // } else {
  const epoch: number | null = await initNewPost();
  return <Writer epoch={1690747613634} />
}

{/* <div className="w-80">
          <pre className="w-8">{JSON.stringify(session, null, 2)}</pre>
        </div> */}