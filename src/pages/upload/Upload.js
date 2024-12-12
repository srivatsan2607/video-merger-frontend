import Navbar from "../../components/Navbar";
import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import fileUploadImage from "../../assets/file.png";
import axios from "axios";
import config from "../../utils/config";
import { ToastContainer, toast } from "react-toast";
import { useNavigate } from "react-router-dom";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#bdbdbd",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "350px",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function StyledDropzone({ onDrop }) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "video/*": [] },
      multiple: true,
      onDrop: onDrop,
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="container h-full mt-20">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <img src={fileUploadImage} />
        <p>Drag 'n' drop your videos here, or click to select files</p>
      </div>
    </div>
  );
}

const UploadPage = () => {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); // Track progress for each file
  const [hasUploadStarted, setHasUploadStarted] = useState(false);
  const tokenStr = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedVideos(acceptedFiles);
    const progressInit = {};
    acceptedFiles.forEach((file) => {
      progressInit[file.name] = 0;
    });
  });

  const handleUpload = async () => {
    if (selectedVideos.length === 0) return;

    setHasUploadStarted(true);

    const formData = new FormData();
    selectedVideos.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    try {
      const response = await axios
        .post(`${config.serverUrl}/upload`, formData, {
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total;
            const current = progressEvent.loaded;
            const percentage = Math.round((current / total) * 100);
            console.log(percentage);
            // Update the progress for all files (since this tracks total progress)
            setUploadProgress(percentage);
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenStr}`,
          },
        })
        .then((response) => {
          // Reset state after upload
          setSelectedVideos([]);
          setUploadProgress(0);
          navigate("/dashboard");
          console.log("Upload successful:", response.data);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
        });
    } catch (error) {
      console.error("Error uploading videos:", error);
    }
  };
  const DisplaySelectedVideos = (
    <div className="grid md:grid-cols-4 gap-4 my-5">
      {selectedVideos.map((video, index) => {
        return (
          <div className="border-slate-400 border-2" key={video.name}>
            <video height={"200px"} controls>
              <source src={URL.createObjectURL(video)} type="video/mp4" />
            </video>
            <p>{selectedVideos[index]?.name}</p>
            <button
              className="w-full bg-red-900 text-white"
              onClick={() => {
                console.log(video.name);
                URL.revokeObjectURL(URL.createObjectURL(video));
                setSelectedVideos((prev) =>
                  prev.filter((file) => {
                    console.log(file.name);
                    return video.name !== file.name;
                  })
                );
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="h-full bg-red">
      <Navbar />
      <div className="container mx-auto h-full">
        <StyledDropzone onDrop={onDrop} />
        {DisplaySelectedVideos}
        <div className="my-5">
          {hasUploadStarted ? (
            <div class="relative size-40">
              <svg
                class="size-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  class="stroke-current text-gray-200 dark:text-neutral-700"
                  stroke-width="2"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  class="stroke-current text-blue-600 dark:text-blue-500"
                  stroke-width="2"
                  stroke-dasharray="100"
                  stroke-dashoffset={100 - uploadProgress}
                  stroke-linecap="round"
                ></circle>
              </svg>

              <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span class="text-center text-base font-bold text-blue-600 dark:text-blue-500">
                  Uploaded {uploadProgress}%
                </span>
              </div>
            </div>
          ) : (
            <div>
              {" "}
              <p
                className="font-sans font-medium text-black tracking-widest"
                style={{ fontSize: "20px" }}
              >
                You can upload multiple videos of mp4 format from here by
                dragging and dropping it in the box or click and select it
                manually. Press the{" "}
                <span className="font-extrabold">UPLOAD VIDEOS</span> button to
                upload your videos. You can view, merge and download it from the
                dashboard page!
              </p>
              <button
                className="bg-blue-300 font-serif font-bold p-4 rounded-md mt-5"
                onClick={() => handleUpload()}
              >
                UPLOAD VIDEOS
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" delay={3000} />
    </div>
  );
};

export default UploadPage;
