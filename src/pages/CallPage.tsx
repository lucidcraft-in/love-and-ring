import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const CallPage = () => {
  const { roomId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId || zpRef.current) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      1995432894,
      "da237b5a688adfd238d18700e0065fbf",
      roomId,
      user._id,
      user.fullName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: containerRef.current!,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
    });

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
    };

  }, [roomId]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default CallPage;