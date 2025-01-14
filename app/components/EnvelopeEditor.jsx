import React, { useRef, useState, useEffect } from "react";

const EnvelopeEditor = ({
  points,
  onChange,
  curvatures,
  onCurvatureChange,
  totalDuration,
}) => {
  const svgRef = useRef();
  const margin = 20;

  // Default dimensions
  const defaultWidth = 400;
  const defaultHeight = 185;

  const [svgWidth, setSvgWidth] = useState(400); // Initial wdefaultWidth);
  const [svgHeight, setSvgHeight] = useState(185); // Initial hdefaultHeight);

  // Update the SVG dimensions based on window size
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.offsetWidth;

        // If the container width is close to the default width, reset to default dimensions
        if (containerWidth >= defaultWidth) {
          setSvgWidth(defaultWidth);
          setSvgHeight(defaultHeight);
        } else {
          // Adjust dimensions proportionally for smaller window sizes
          const newWidth = containerWidth;
          const newHeight = newWidth / 2; // Maintain a 2:1 aspect ratio
          setSvgWidth(newWidth);
          setSvgHeight(newHeight);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount to set the initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDrag = (index, event) => {
    const rect = svgRef.current.getBoundingClientRect();
    const svgWidth = rect.width - 2 * margin; // margin
    const svgHeight = rect.height - 2 * margin;

    const newTime = Math.min(
      Math.max((event.clientX - rect.left - margin) / svgWidth, 0),
      1
    );
    const newAmplitude =
      1 -
      Math.min(Math.max((event.clientY - rect.top - margin) / svgHeight, 0), 1);

    const updatedPoints = [...points];

    if (index === 0 || index === points.length - 1) {
      return; // Prevent moving the first and last points
    }

    if (index === 1) {
      updatedPoints[index].time = Math.min(newTime, points[2].time);
      updatedPoints[index].amplitude = newAmplitude;
    } else if (index === 2) {
      updatedPoints[index].time = Math.max(
        Math.min(newTime, points[3].time),
        points[1].time
      );
      updatedPoints[index].amplitude = newAmplitude;
    } else if (index === 3) {
      updatedPoints[index].time = Math.max(newTime, points[2].time);
      updatedPoints[index].amplitude = newAmplitude;
    }

    if (onChange) onChange(updatedPoints);
  };

  // const handleCurvatureChange = (index, event) => {
  //   const updatedCurvatures = [...curvatures];
  //   updatedCurvatures[index] = parseFloat(event.target.value);
  //   if (onCurvatureChange) onCurvatureChange(updatedCurvatures);
  // };

  return (
    <div className="flex flex-col text-slate-800 p-4 sm:p-4 rounded-md w-full max-w-lg space-y-4 mx-auto fg-color shadow-lg">
      <p className="text-center font-bold text-xl">Envelope Editor</p>

      <div
        ref={svgRef}
        className="relative w-full h-45 ac-color rounded-lg shadow-md"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            // border: "2px solid #4B5563",
            borderRadius: "8px",
          }}
        >
          {/* Draw the polyline */}
          <polyline
            points={points
              .map(
                (p) =>
                  `${p.time * (svgWidth - 2 * margin) + margin},${
                    (1 - p.amplitude) * (svgHeight - 2 * margin) + margin
                  }`
              )
              .join(" ")}
            stroke="#83c5be"
            fill="none"
            strokeWidth="3"
          />
          {/* Render points */}
          {points.map((point, index) => {
            const isFirstOrLast = index === 0 || index === points.length - 1;

            return (
              <g key={index}>
                {isFirstOrLast ? (
                  // Render a semicircle for the first and last points
                  <path
                    d={`
            M ${point.time * (svgWidth - 2 * margin) + margin - 8}, ${
                      (1 - point.amplitude) * (svgHeight - 2 * margin) + margin
                    }
            a 8,8 0 1,1 16,0
          `}
                    fill="#1e293b"
                    strokeWidth="3"
                  />
                ) : (
                  // Render a regular circle for other points
                  <circle
                    cx={point.time * (svgWidth - 2 * margin) + margin}
                    cy={
                      (1 - point.amplitude) * (svgHeight - 2 * margin) + margin
                    }
                    r={7}
                    fill="#765DD3"
                    strokeWidth="2"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const moveListener = (moveEvent) =>
                        handleDrag(index, moveEvent);
                      const upListener = () => {
                        window.removeEventListener("mousemove", moveListener);
                        window.removeEventListener("mouseup", upListener);
                      };
                      window.addEventListener("mousemove", moveListener);
                      window.addEventListener("mouseup", upListener);
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default EnvelopeEditor;

{
  /* Curvature Controls */
}
{
  /* Add custom controls for curvature if required */
}
{
  /* <div className="flex flex-col space-y-2">
        <label className="text-sm">Attack Curvature</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={curvatures[0]}
          onChange={(e) => handleCurvatureChange(0, e)}
          className="slider"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm">Decay Curvature</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={curvatures[1]}
          onChange={(e) => handleCurvatureChange(1, e)}
          className="slider"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm">Release Curvature</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={curvatures[2]}
          onChange={(e) => handleCurvatureChange(2, e)}
          className="slider"
        />
      </div> */
}
//     </div>
//   );
// };
