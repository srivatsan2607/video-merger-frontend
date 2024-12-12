import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import config from "../../utils/config";
import { ToastContainer, toast } from "react-toast";
import axios from "axios";
import Timer from "../../components/Timer";
import Dialog from "../../components/Modal";

const MergedVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenStr = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        await axios
          .get(`${config.serverUrl}/videos/merged`, {
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

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="rounded-lg p-6 text-surface shadow-lg bg-violet-100  shadow-black/30 mt-5 text-black">
        <h2 className="text-3xl font-semibold">Welcome to Streak</h2>
        <p>View all your merged videos in this section.</p>
        <hr className="my-6 h-0.5 border-t-0 bg-neutral-900 bg-black/10" />
      </div>
      {loading ? (
        <div role="status" className="my-20 mx-auto w-52">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-4 my-5 items-center p-4">
          {videos.map((video, index) => (
            <div key={index}>
              <video height={"100px"} controls>
                <source src={video.url} type="video/mp4" />
              </video>
              <p className="text-sm text-gray-800 w-full border-2 border-black p-2 ">
                {video.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" delay={3000} />
    </div>
  );
};

export default MergedVideosPage;
