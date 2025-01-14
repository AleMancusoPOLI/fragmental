import React, { useState, useEffect, useRef } from "react";

const ExpandingCircle = React.forwardRef((props, ref) => {
  const [circles, setCircles] = useState([]);
  const containerRef = useRef(null);

  React.useImperativeHandle(ref, () => ({
    createCircle: () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const id = Date.now(); // Unique identifier for each circle
        const randomPosition = {
          top: Math.random() * containerRect.height, // Random top position inside the container
          left: Math.random() * containerRect.width, // Random left position inside the container
        };
        setCircles((prevCircles) => [
          ...prevCircles,
          { id, createdAt: Date.now(), position: randomPosition },
        ]);
      }
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
      ref={containerRef}
      className="relative w-36 h-36 rounded-xl bg-gray-300 overflow-hidden mx-auto shadow-lg"
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
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
      }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-purple-400"
    ></div>
  );
};

export default ExpandingCircle;
