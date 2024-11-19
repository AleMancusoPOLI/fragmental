"use client";

import React, { useState } from "react";
import Dropzone from "./components/Dropzone";
import Samplezone from "./components/Samplezone";

export default function Home() {
  const [fileUrl, setFileUrl] = useState(null);

  return (
    <section className="section">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p>ACTAM sick crazy granulizer project!!!</p>
        <div className="rounded-sm border-solid border-4 border-black">
          <div className="m-4">
            <Dropzone
              onFileDrop={setFileUrl}
              className="m-1 p-2 rounded border-2 border-solid"
            ></Dropzone>
            {fileUrl && <Samplezone fileUrl={fileUrl} />}
            <p>Base parameters:</p>
            <p>- mix</p>
            <p>- input/output gain</p>
            <p>- transpose</p>
            <p>Granulizer parameters</p>
            <p>- ?</p>
            <p>- ?</p>
          </div>
        </div>
      </div>
    </section>
  );
}
