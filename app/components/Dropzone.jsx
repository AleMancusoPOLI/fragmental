"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ onFileDrop, className }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log(file);

        const url = URL.createObjectURL(file);

        onFileDrop(url); // Pass the file URL to the parent
      } else {
        console.log("Invalid format");
      }
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps({
        className: className,
      })}
    >
      <input {...getInputProps()} />
      <div>Drop your sample here</div>
    </div>
  );
}

export default Dropzone;
