"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ className }) {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFile) => {
    if (acceptedFile) {
      console.log(acceptedFile);
      setFile(acceptedFile);
    } else {
      console.log("Invalid format");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    maxFiles: 1,
  });

  return (
    <form>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} />
        <div>Drop your sample here</div>
      </div>
    </form>
  );
}

export default Dropzone;
