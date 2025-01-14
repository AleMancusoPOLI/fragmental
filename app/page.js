"use client";

import React, { useEffect, useRef, useState } from "react";

// Import components
import Dropzone from "./components/Dropzone";
import Player from "./components/Player";
import Visualizer from "./components/Visualizer";
import Library from "./components/Library";
import ExpandingCircle from "./components/ExpandingCircle";
import Tooltip from "./components/Tooltip";
import LibraryIcon from "../public/assets/library_image.svg";

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
                width="449"
                height="448"
                viewBox="0 0 449 448"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"  // This will set the width and height to 2rem (32px) by default
                style={{ marginTop: '20px', marginLeft: '10px' }}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M24 0.587012C14.892 2.91301 6.744 9.57801 2.476 18.197L0 23.197V223.697V424.197L2.257 428.728C5.807 435.853 9.843 440.063 16.675 443.768L23 447.197H47.5H72L78.301 443.78C85.3 439.985 88.314 436.871 92.305 429.304L95 424.197V223.697V23.197L91.571 16.872C87.86 10.028 83.635 5.98301 76.531 2.47201C72.29 0.377014 70.558 0.220014 49.5 0.0270143C37.125 -0.0859857 25.65 0.166012 24 0.587012ZM152 0.587012C142.892 2.91301 134.744 9.57801 130.476 18.197L128 23.197V223.697V424.197L130.257 428.728C133.807 435.853 137.843 440.063 144.675 443.768L151 447.197H175.5H200L206.301 443.78C213.3 439.985 216.314 436.871 220.305 429.304L223 424.197V223.697V23.197L219.571 16.872C215.86 10.028 211.635 5.98301 204.531 2.47201C200.29 0.377014 198.558 0.220014 177.5 0.0270143C165.125 -0.0859857 153.65 0.166012 152 0.587012ZM309.814 3.18901C296.357 6.13901 273.779 12.939 269.887 15.215C261.24 20.272 255.6 29.561 254.755 40.136C254.309 45.728 258.112 60.543 303.931 231.697C331.244 333.722 354.495 419.975 355.601 423.37C358.266 431.551 363.782 437.726 372.073 441.807C381.574 446.485 387.28 446.183 410.427 439.778C420.562 436.974 430.738 433.576 433.04 432.226C441.768 427.112 447.401 417.86 448.241 407.258C448.685 401.668 444.791 386.526 398.123 212.33C370.293 108.453 346.52 21.455 345.295 19C341.12 10.641 330.559 3.55601 320.5 2.36601C318.025 2.07301 313.216 2.44401 309.814 3.18901Z"
                  fill="#006C76"
                />
              </svg>

            ) : (
              <svg
                width="449"
                height="448"
                viewBox="0 0 449 448"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"  // This will set the width and height to 2rem (32px) by default
                style={{ marginTop: '20px', marginLeft: '10px' }}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M24 0.587012C14.892 2.91301 6.744 9.57801 2.476 18.197L0 23.197V223.697V424.197L2.257 428.728C5.807 435.853 9.843 440.063 16.675 443.768L23 447.197H47.5H72L78.301 443.78C85.3 439.985 88.314 436.871 92.305 429.304L95 424.197V223.697V23.197L91.571 16.872C87.86 10.028 83.635 5.98301 76.531 2.47201C72.29 0.377014 70.558 0.220014 49.5 0.0270143C37.125 -0.0859857 25.65 0.166012 24 0.587012ZM152 0.587012C142.892 2.91301 134.744 9.57801 130.476 18.197L128 23.197V223.697V424.197L130.257 428.728C133.807 435.853 137.843 440.063 144.675 443.768L151 447.197H175.5H200L206.301 443.78C213.3 439.985 216.314 436.871 220.305 429.304L223 424.197V223.697V23.197L219.571 16.872C215.86 10.028 211.635 5.98301 204.531 2.47201C200.29 0.377014 198.558 0.220014 177.5 0.0270143C165.125 -0.0859857 153.65 0.166012 152 0.587012ZM309.814 3.18901C296.357 6.13901 273.779 12.939 269.887 15.215C261.24 20.272 255.6 29.561 254.755 40.136C254.309 45.728 258.112 60.543 303.931 231.697C331.244 333.722 354.495 419.975 355.601 423.37C358.266 431.551 363.782 437.726 372.073 441.807C381.574 446.485 387.28 446.183 410.427 439.778C420.562 436.974 430.738 433.576 433.04 432.226C441.768 427.112 447.401 417.86 448.241 407.258C448.685 401.668 444.791 386.526 398.123 212.33C370.293 108.453 346.52 21.455 345.295 19C341.12 10.641 330.559 3.55601 320.5 2.36601C318.025 2.07301 313.216 2.44401 309.814 3.18901Z"
                  fill="#0891B2"
                />
              </svg>

            )}
          </button>
        </div>

        <div className="rounded-md border-solid border-2 border-black bg-color">
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
        { }
      </div>
    </section>
  );
}
