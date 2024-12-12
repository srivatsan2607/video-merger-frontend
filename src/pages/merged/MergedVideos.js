import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import config from "../../utils/config";
import { ToastContainer, toast } from "react-toast";
import axios from "axios";
import Timer from "../../components/Timer";
import Dialog from "../../components/Modal";
import Spinner from "../../components/Spinner";

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
        <Spinner />
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
