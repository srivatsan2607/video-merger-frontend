import React, { useState, useEffect } from "react";

const Timer = ({ count, status }) => {
  return (
    <div className="flex items-center min-h-52 justify-center w-full bg-gray-100 text-wrap">
      <div className="text-center text-wrap">
        <div className="flex items-center">
          <p className="text-black font-sans text-3xl mr-6 tracking-widest">
            Fetching status in{" "}
          </p>
          <div className="mt-5 text-6xl font-extrabold text-blue-600">
            {count}
          </div>
        </div>
        <div className="text-wrap">
          <p className="text-black font-mono text-3xl tracking-widest font-semibold">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
