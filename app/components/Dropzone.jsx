"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ onFileDrop, className }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length == 1) {
        const file = acceptedFiles[0];

        const url = URL.createObjectURL(file);
        onFileDrop(url); // Pass the file URL to the page
      } else {
        console.log("Invalid format");
      }
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "audio/*": [] }, // constraint on audio format
    maxFiles: 1, // constraint on number of files at a time
  });

  return (
    <div className="m-1 p-2 rounded border-2 border-solid">
      <input {...getInputProps()} />
      <div>Drop your sample here</div>
    </div>
  );
}

export default Dropzone;
