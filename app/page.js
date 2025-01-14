"use client";

import React, { useEffect, useRef, useState } from "react";

// Import components
import Dropzone from "./components/Dropzone";
import Player from "./components/Player";
import Visualizer from "./components/Visualizer";
import Library from "./components/Library";
import ExpandingCircle from "./components/ExpandingCircle";
import Tooltip from "./components/Tooltip";

export default function Home() {
  const [fileUrl, setFileUrl] = useState(null); // URL of the sample, used both by Visualizer and Player
  const [wavesurferInstance, setWavesurferInstance] = useState(null); // Instance of the sample visualizer, used by Player to sync with Visualizer
  const [gainNode, setGainNode] = useState(null);
  const [isLibraryOn, seIsLibraryOn] = useState(true); // used for hiding/displaying library

  const circleRef = useRef();

  const handleCreateCircle = () => {
    if (circleRef.current) {
      circleRef.current.createCircle(); // Call this function to create a new circle
    }
  };

  useEffect(() => {
    if (fileUrl) seIsLibraryOn(false);
  }, [fileUrl]);

  return (
    <section className="section">
      <div className="items-center min-h-screen px-8 pb-20 gap-16 sm:px-20 sm:py-5 font-[family-name:var(--font-geist-sans)]">
        <p className="text-center font-bold text-slate-800">FRAGMENTAL</p>
        <p className="text-center font-thin">
          Double click the knobs to reset their values
        </p>
        <p className="text-center font-thin">
          Click the Play button or press 'p' on your keyboard to start the
          playback
        </p>

        <div className="relative group w-min">
          <div
            className="z-10 absolute transform -translate-x-10 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ bottom: "85%" }}
          >
            <Tooltip description={"Show/hide library"} value={""} />
          </div>
          <button
            onClick={() => {
              seIsLibraryOn(!isLibraryOn);
            }}
            className="focus:outline-none"
          >
            {isLibraryOn ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-purple-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="rounded-sm border-solid border-4 border-black bg-color">
          <div className="m-4">
            <div className="">
              <div className={"grid grid-cols-1 gap-2 pb-2"}>
                <Dropzone
                  className={`${isLibraryOn ? "" : "hidden"}`}
                  onFileSelected={setFileUrl}
                />
                <Library
                  className={`${isLibraryOn ? "" : "hidden"}`}
                  onFileSelected={setFileUrl}
                />
              </div>
            </div>
            <div className="text-white rounded-md w-full flex justify-between items-center gap-2">
              {wavesurferInstance && (
                <ExpandingCircle ref={circleRef}></ExpandingCircle>
              )}
              <Visualizer
                fileUrl={fileUrl}
                onSampleReady={setWavesurferInstance} // when onSampleReady is called in Dropzone, then setWavesurferInstance is called here with the same argument
              />
            </div>
            <div className="w-full flex justify-between items-center gap-4">
              {wavesurferInstance && (
                <div className="w-full">
                  <Player
                    fileUrl={fileUrl}
                    wavesurferInstance={wavesurferInstance} // reference to the visualizer instance in Visualizer
                    onGainNodeReady={setGainNode}
                    onPlayGrain={handleCreateCircle}
                  />
                </div>
              )}{" "}
            </div>
          </div>
        </div>
        {}
      </div>
    </section>
  );
}
