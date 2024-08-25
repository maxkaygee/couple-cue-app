import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export function SwipeableActivityCard({ activity, onSwipe }) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      setExitX(-250);
      onSwipe('left', activity);
    } else if (info.offset.x > 100) {
      setExitX(250);
      onSwipe('right', activity);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ duration: 0.2 }}
      className="absolute w-64 h-80 bg-white rounded-lg shadow-md p-4 cursor-grab"
    >
      <h3 className="text-xl font-semibold mb-2">{activity.activity}</h3>
      <p className="text-gray-600 mb-1">{activity.category}</p>
      <p className="text-gray-600 mb-4">{activity.subcategory}</p>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
        <button
          onClick={() => onSwipe('left', activity)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
        <button
          onClick={() => onSwipe('right', activity)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
      </div>
    </motion.div>
  );
}