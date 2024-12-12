import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import config from "../../utils/config";
import { ToastContainer, toast } from "react-toast";
import axios from "axios";
import Timer from "../../components/Timer";
import Dialog from "../../components/Modal";

const DashboardPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenStr = localStorage.getItem("authToken");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [hasMergingStarted, setHasMergingStarted] = useState(false);
  const [count, setCount] = useState(4);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        await axios
          .get(`${config.serverUrl}/videos`, {
            headers: { Authorization: "Bearer " + tokenStr },
          })
          .then((response) => {
            setVideos(response.data.videos);
          })
          .catch((error) => toast.error(error?.response?.data?.message));
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const selectVideoHandler = (video, select) => {
    if (select) {
      setSelectedVideos((prev) => [...prev, video]);
    } else {
      setSelectedVideos((prev) =>
        prev.filter((file) => video.name !== file.name)
      );
    }
  };

  const handleMerge = async () => {
    const mergeFiles = selectedVideos.map((file) => file.name);
    try {
      setHasMergingStarted(true);
      await axios
        .post(
          `${config.serverUrl}/merge`,
          {
            files: mergeFiles,
          },
          { headers: { Authorization: tokenStr } }
        )
        .then((response) => {
          setTaskId(response.data.task_id);
          setStatus("Merging started...");
          pollTaskStatus(response.data.task_id);
          toast.info("Merging Started");
          setIsOpenModal(true);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
          setIsOpenModal(false);
          setHasMergingStarted(false);
        });
    } catch (error) {
      toast.error("Error starting merge:", error?.response?.data?.message);
    }
  };

  const pollTaskStatus = (taskId) => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          return 4;
        }
        return prevCount - 1;
      });
    }, 1200);
    const interval = setInterval(async () => {
      const response = await axios.get(`${config.serverUrl}/status/${taskId}`);
      if (response.data.state === "SUCCESS") {
        setStatus(`Merge complete: ${response.data.result.file}`);
        setCount(5);
        clearInterval(interval);
        clearInterval(countdownInterval);
        setHasMergingStarted(false);
        setSelectedVideos([]);
      } else if (response.data.state === "FAILURE") {
        setStatus(`Merge Failed: ${response.data.error}`);
        clearInterval(interval);
        setCount(4);
        clearInterval(countdownInterval);
        setHasMergingStarted(false);
      } else {
        setStatus(response.data.status);
      }
    }, 5000); // Poll every 5 seconds
  };

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="rounded-lg p-6 text-surface shadow-lg bg-violet-100  shadow-black/30 mt-5 text-black">
        <h2 className="text-3xl font-semibold">Welcome to Streak</h2>
        <p>View all your uploaded videos in this section.</p>
        <hr className="my-6 h-0.5 border-t-0 bg-neutral-900 bg-black/10" />
        <p className="mb-4">
          Select the video you want to merge, click on the merge button and
          track your progress in real-time.
        </p>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-4 my-5 items-center p-4">
        {videos.map((video, index) => (
          <div key={index}>
            <video
              height={"100px"}
              controls
              className={
                selectedVideos.some((item) => item.name === video.name)
                  ? "border-green-600 border-8 shadow-black"
                  : ""
              }
            >
              <source src={video.url} type="video/mp4" />
            </video>
            {selectedVideos.some((item) => item.name === video.name) ? (
              <button
                className="bg-red-600 text-white w-full p-4 rounded-md"
                onClick={() => selectVideoHandler(video, false)}
              >
                UNSELECT
              </button>
            ) : (
              <button
                className="bg-blue-200 text-black w-full p-4 rounded-md"
                onClick={() => selectVideoHandler(video, true)}
              >
                SELECT
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedVideos.length > 1 && !hasMergingStarted && (
        <div className="mx-auto w-2/5">
          <button
            className="rounded-lg p-5 w-full bg-violet-100 font-serif font-extrabold text-3xl text-black tracking-widest"
            onClick={() => handleMerge()}
          >
            Merge Selected Videos
          </button>
        </div>
      )}
      {hasMergingStarted && (
        <Dialog
          count={count}
          status={status}
          setIsOpenModal={setIsOpenModal}
          isOpenModal={isOpenModal}
        />
      )}
      <ToastContainer position="top-right" delay={3000} />
    </div>
  );
};

export default DashboardPage;
