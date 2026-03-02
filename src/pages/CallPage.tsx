import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Axios from "@/axios/axios";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const CallPage = () => {
  const { roomId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCall = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await Axios.post(
        "/api/zego/token",
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { appID, token: zegoToken } = res.data;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(appID),
        zegoToken,
        roomId!,
        user._id,
        user.fullName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current!,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    };

    initCall();
  }, [roomId]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default CallPage;