import React, { useState, useEffect } from "react";

const ExpandingCircle = React.forwardRef((props, ref) => {
  const [circles, setCircles] = useState([]);

  React.useImperativeHandle(ref, () => ({
    createCircle: () => {
      const id = Date.now(); // Unique identifier for each circle
      const randomPosition = {
        top: Math.random() * 100, // Random top position in percentage
        left: Math.random() * 100, // Random left position in percentage
      };
      setCircles((prevCircles) => [
        ...prevCircles,
        { id, createdAt: Date.now(), position: randomPosition },
      ]);
    },
  }));

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCircles((prevCircles) =>
        prevCircles.filter((circle) => now - circle.createdAt < 4000)
      );
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div
      style={{
        position: "fixed", // Keeps it fixed in the background
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: -1, // Ensures it is behind other content
      }}
    >
      {circles.map((circle) => (
        <Circle
          key={circle.id}
          createdAt={circle.createdAt}
          position={circle.position}
        />
      ))}
    </div>
  );
});

const Circle = ({ createdAt, position }) => {
  const [size, setSize] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - createdAt;
      if (elapsed >= 4000) {
        clearInterval(interval);
        return;
      }
      const newSize = (elapsed / 1000) * 200; // Calculate size proportionally
      setSize(newSize);
    }, 50);

    return () => clearInterval(interval);
  }, [createdAt]);

  const opacity = 0.4 - (Date.now() - createdAt) / 4000;

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: "translate(-50%, -50%)",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        opacity: opacity,
      }}
      className="border-4 border-purple-400 border-solid"
    ></div>
  );
};

export default ExpandingCircle;
