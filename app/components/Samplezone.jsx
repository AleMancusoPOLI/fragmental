"use client";

import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

function Samplezone({ fileUrl }) {
  const wavesurferRef = useRef(null);
  const waveformContainerRef = useRef(null);

  useEffect(() => {
    if (waveformContainerRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: "#ddd",
        progressColor: "#f76565",
        barWidth: 2,
        responsive: true,
      });
    }

    return () => {
      // Clean up Wavesurfer instance
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (fileUrl && wavesurferRef.current) {
      wavesurferRef.current.load(fileUrl);
    }
  }, [fileUrl]);

  return (
    <div
      ref={waveformContainerRef}
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
}

export default Samplezone;
