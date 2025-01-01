"use client";

import React, { useState } from "react";

// Import components
import Dropzone from "./components/Dropzone";
import Player from "./components/Player";
import Visualizer from "./components/Visualizer";
import Effects from "./components/Effects";
import Library from "./components/Library";

export default function Home() {
  const [fileUrl, setFileUrl] = useState(null); // URL of the sample, used both by Visualizer and Player
  const [wavesurferInstance, setWavesurferInstance] = useState(null); // Instance of the sample visualizer, used by Player to sync with Visualizer
  const [gainNode, setGainNode] = useState(null);

  return (
    <section className="section">
      <div className="items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="text-center font-bold">FRAGMENTAL</p>
        <p className="text-center font-thin">Double click to reset values</p>
        <div className="rounded-sm border-solid border-4 border-black">
          <div className="m-4">
            <div className="m-2">
              <Dropzone
                onFileDrop={setFileUrl} // when onFileDrop is called in Dropzone, then setFileUrl is called here with the same argument
              ></Dropzone>
              <Library onFileSelected={setFileUrl}></Library>
            </div>
            <Visualizer
              fileUrl={fileUrl}
              onSampleReady={setWavesurferInstance} // when onSampleReady is called in Dropzone, then setWavesurferInstance is called here with the same argument
            />
            {wavesurferInstance && (
              <Player
                fileUrl={fileUrl}
                wavesurferInstance={wavesurferInstance} // reference to the visualizer instance in Visualizer
                onGainNodeReady={setGainNode}
              />
            )}
            {gainNode && <Effects gainNode={gainNode} />}
          </div>
        </div>
        <p className="text-center">Merry Christmas!</p>
      </div>
    </section>
  );
}
