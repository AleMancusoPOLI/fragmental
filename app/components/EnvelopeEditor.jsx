import React, { useRef } from "react";

const EnvelopeEditor = ({ points, onChange, curvatures, onCurvatureChange, totalDuration }) => {
  const svgRef = useRef();
  const margin = 20;

  const handleDrag = (index, event) => {
    const rect = svgRef.current.getBoundingClientRect();
    const svgWidth = rect.width - 2 * margin; // margin
    const svgHeight = rect.height - 2 * margin; 

    const newTime = Math.min(Math.max((event.clientX - rect.left - margin) / svgWidth, 0), 1);
    const newAmplitude = 1 - Math.min(Math.max((event.clientY - rect.top - margin) / svgHeight, 0), 1);

    const updatedPoints = [...points];

    if (index === 0 || index === points.length - 1) {
      return; // Prevent moving the first and last points
    }

    if (index === 1) {
      updatedPoints[index].time = Math.min(newTime, points[2].time);
      updatedPoints[index].amplitude = newAmplitude;
    } else if (index === 2) {
      updatedPoints[index].time = Math.max(Math.min(newTime, points[3].time), points[1].time);
      updatedPoints[index].amplitude = newAmplitude;
    } else if (index === 3) {
      updatedPoints[index].time = Math.max(newTime, points[2].time);
      updatedPoints[index].amplitude = newAmplitude;
    }

    if (onChange) onChange(updatedPoints);
  };

  const handleCurvatureChange = (index, event) => {
    const updatedCurvatures = [...curvatures];
    updatedCurvatures[index] = parseFloat(event.target.value);
    if (onCurvatureChange) onCurvatureChange(updatedCurvatures);
  };

  return (
    <div>
      <svg
        ref={svgRef}
        width="400"
        height="200"
        style={{ border: "2px solid black", backgroundColor: "white" }}
      >
        {/* Draw the polyline inside the margin */}
        <polyline
          points={points
            .map(
              (p) =>
                `${p.time * (400 - 2 * margin) + margin},${
                  (1 - p.amplitude) * (200 - 2 * margin) + margin
                }`
            )
            .join(" ")}
          stroke="blue"
          fill="none"
        />
        {/* Render each point */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.time * (400 - 2 * margin) + margin}
              cy={(1 - point.amplitude) * (200 - 2 * margin) + margin}
              r={index === 0 || index === points.length - 1 ? 8 : 6}
              fill={index === 0 || index === points.length - 1 ? "gray" : "red"}
              onMouseDown={(e) => {
                if (index === 0 || index === points.length - 1) return;
                e.preventDefault();
                const moveListener = (moveEvent) => handleDrag(index, moveEvent);
                const upListener = () => {
                  window.removeEventListener("mousemove", moveListener);
                  window.removeEventListener("mouseup", upListener);
                };
                window.addEventListener("mousemove", moveListener);
                window.addEventListener("mouseup", upListener);
              }}
            />
            {index !== 0 && index !== points.length - 1 && (
              <text
                x={point.time * (400 - 2 * margin) + margin + 5}
                y={(1 - point.amplitude) * (200 - 2 * margin) + margin - 5}
                fontSize="12"
                fill="black"
              >
                {`(${(point.time * totalDuration).toFixed(2)}s, ${(point.amplitude * 100).toFixed(1)}%)`}
              </text>
            )}
          </g>
        ))}
      </svg>
      {/* Curvature Controls */}
      <div>
        <label>Attack Curvature</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={curvatures[0]}
          onChange={(e) => handleCurvatureChange(0, e)}
        />
      </div>
      <div>
        <label>Decay Curvature</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={curvatures[1]}
          onChange={(e) => handleCurvatureChange(1, e)}
        />
      </div>
      <div>
        <label>Release Curvature</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={curvatures[2]}
          onChange={(e) => handleCurvatureChange(2, e)}
        />
      </div>
    </div>
  );
};

export default EnvelopeEditor;
