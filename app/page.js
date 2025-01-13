"use client";

import React, { useEffect, useState } from "react";

// Import components
import Dropzone from "./components/Dropzone";
import Player from "./components/Player";
import Visualizer from "./components/Visualizer";
import Library from "./components/Library";

export default function Home() {
  const [fileUrl, setFileUrl] = useState(null); // URL of the sample, used both by Visualizer and Player
  const [wavesurferInstance, setWavesurferInstance] = useState(null); // Instance of the sample visualizer, used by Player to sync with Visualizer
  const [gainNode, setGainNode] = useState(null);
  const [isLibraryOn, seIsLibraryOn] = useState(true); // used for hiding/displaying library

  useEffect(() => {
    if (fileUrl) seIsLibraryOn(false);
  }, [fileUrl]);

  return (
    <section className="section">
      <div className="items-center min-h-screen px-8 pb-20 gap-16 sm:px-20 sm:py-5 font-[family-name:var(--font-geist-sans)]">
        <p className="text-center font-bold">FRAGMENTAL</p>
        <p className="text-center font-thin">Double click to reset values</p>
        <p className="text-center font-thin">
          Click 'Play' or press 'p' on your keyboard to start the playback
        </p>
        <button
          onClick={() => {
            seIsLibraryOn(!isLibraryOn);
          }}
        >
          {isLibraryOn ? "Hide library" : "Show library"}
        </button>
        {/* <div className="rounded-sm border-solid border-4 border-black"> */}
        <div>
          <div className="m-4">
            <div className="m-2">
              <div className={"grid grid-cols-1 gap-2 pb-2"}>
                <Dropzone onFileSelected={setFileUrl} />
                <Library
                  className={`${isLibraryOn ? "" : "hidden"}`}
                  onFileSelected={setFileUrl}
                />
              </div>
            </div>
            <Visualizer
              fileUrl={fileUrl}
              onSampleReady={setWavesurferInstance} // when onSampleReady is called in Dropzone, then setWavesurferInstance is called here with the same argument
            />
            {wavesurferInstance && (
              <div className="flex items-center justify-center space-x-4">
                <Player
                  fileUrl={fileUrl}
                  wavesurferInstance={wavesurferInstance} // reference to the visualizer instance in Visualizer
                  onGainNodeReady={setGainNode}
                />
              </div>
            )}
            {/* {gainNode && <Effects gainNode={gainNode} />} */}
          </div>
        </div>
        {/* <p className="text-center">Have a nice day :)</p> */}
      </div>
    </section>
  );
}
