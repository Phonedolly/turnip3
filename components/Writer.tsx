'use client';

import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import MdxEditor from "./MDXEditor";
import SignOut from "./SignOut";
import ImageIcon from "./ImageIcon";

export default function Writer() {
  const [isShowImagesPopup, setIsShowImagesPopup] = useState<boolean>(false);
  const [post, setPost] = useState<IPost>({});

  return <div className="flex flex-col h-full items-center">
    <SignOut />
    <div className="h-1/2 w-full bg-red-500" >
      <div className="flex flex-row items-center justify-between h-12 w-full bg-yellow-500" key={uuidv4()}>
        <ImageIcon className="w-12 h-12 p-2 cursor-pointer" onClick={() => setIsShowImagesPopup(true)} />
      </div>
      <MdxEditor setPost={setPost} />
    </div>
    <div className="w-full h-50vh py-12 px-10 overflow-y-scroll" key={uuidv4()}>{post.content}</div>
    {isShowImagesPopup === true ? <div className="fixed flex flex-row items-center justify-center w-full h-full bg-black/20">
      <div className="flex flex-col items-center justify-center w-[70vw] h-[50vh] bg-white">
        <p>Upload images</p>
        <input type="file" className="w-full h-full" accept="image/*" onChange={uploadImage} />
      </div>
    </div> : null}
  </div>
}


const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]!;
  const filename = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);



  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);

  const res = await fetch("/api/writer", {
    method: "POST", body: formData,
  });

  console.log(await res.json())

}