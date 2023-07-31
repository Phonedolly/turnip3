import Image from "next/image";
import { ImageResponse } from "next/server";

export default function AppIcon(props: { className?: string }) {
  return (
    <div className={`relative ${props?.className !== undefined ? props.className : ""}`}>
      <Image
        src={process.env.NEXT_PUBLIC_APP_ICON as string}
        alt="App Icon"
        unoptimized
        fill
      />
    </div>
  );
}
