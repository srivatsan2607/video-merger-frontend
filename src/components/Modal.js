import React, { useState } from "react";
import Timer from "./Timer";

const Dialog = ({ count, status, isOpenModal, setIsOpenModal }) => {
  return (
    <div>
      {/* Dialog Overlay */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          {/* Dialog Box */}
          <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg ">
            <div className="w-full text-wrap">
              <Timer count={count} status={status} />
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => setIsOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialog;
