"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ onFileSelected }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log("file dropped");
      if (acceptedFiles && acceptedFiles.length === 1) {
        const file = acceptedFiles[0];

        const url = URL.createObjectURL(file);
        onFileSelected(url); // Pass the file URL to the parent
      } else {
        console.log("Invalid format or multiple files");
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "audio/*": [] }, // Constraint for audio files
    maxFiles: 1, // Maximum 1 file at a time
  });

  return (
    <div
      {...getRootProps()} // Attach the dropzone handlers here
      className={`m-1 p-2 rounded border-2 border-dashed border-gray-500`}
    >
      <input {...getInputProps()} />
      <div>Drop your sample here</div>
    </div>
  );
}

export default Dropzone;
