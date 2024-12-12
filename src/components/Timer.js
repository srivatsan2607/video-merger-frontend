import React, { useState, useEffect } from "react";

const Timer = ({ count, status }) => {
  return (
    <div className="flex items-center justify-center h-52 bg-gray-100">
      <div className="text-center">
        <div className="flex items-center">
          <p className="text-black font-sans text-3xl mr-6 tracking-widest">
            Fetching status in{" "}
          </p>
          <div className="mt-5 text-6xl font-extrabold text-blue-600">
            {count}
          </div>
        </div>
        <div className="">
          <p className="text-black font-mono text-3xl tracking-widest font-semibold">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
