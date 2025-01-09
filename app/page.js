"use client";

import React, { useState } from "react";

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

  return (
    <section className="section">
      <div className="items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="text-center font-bold">FRAGMENTAL</p>
        <p className="text-center font-thin">Double click to reset values</p>
        <p className="text-center font-thin">Click 'Play' or press 'p' on your keyboard to start the playback</p>
        <button onClick={() => {seIsLibraryOn(!isLibraryOn)}}>
          {isLibraryOn ? "Show library" : "Close library"}
        </button>
        <div className="rounded-sm border-solid border-4 border-black">
          <div className="m-4">
            <div className="m-2">
              <div className="grid grid-cols-2 gap-4">
                {isLibraryOn && <Dropzone onFileSelected={setFileUrl} /> /*when onFileDrop is called in Dropzone, then setFileUrl is called here with the same argument}*/ }
                {isLibraryOn && <Library onFileSelected={setFileUrl} />}
              </div>
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
            {/* {gainNode && <Effects gainNode={gainNode} />} */}
            
            
          </div>
        </div>
        <p className="text-center">Have a nice day :)</p>
      </div>
    </section>
  );
}
