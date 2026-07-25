import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import socket from "@/socket";
import { toast } from "sonner";

const CallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId || zpRef.current) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleCallRejected = ({ roomId: rejectedRoomId, reason }: { roomId: string; reason?: string }) => {
      if (rejectedRoomId === roomId) {
        toast.error(reason || "Call was rejected");
        navigate(-1);
      }
    };

    const handleCallAccepted = ({ roomId: acceptedRoomId }: { roomId: string }) => {
      if (acceptedRoomId === roomId) {
        toast.success("Call connected");
      }
    };

    socket.on("call-rejected", handleCallRejected);
    socket.on("call-accepted", handleCallAccepted);

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      2045140554,
      "e226659060e96da78e82c2133c804e88",
      roomId,
      user._id || Date.now().toString(),
      user.fullName || "User"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: containerRef.current!,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      onLeaveRoom: () => {
        navigate(-1);
      },
    });

    return () => {
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-accepted", handleCallAccepted);

      if (roomId && user?._id) {
        const parts = roomId.split("_");
        if (parts.length === 3) {
          const targetId = parts[1] === user._id ? parts[2] : parts[1];
          socket.emit("cancel-call", { to: targetId, roomId });
        }
      }

      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
    };

  }, [roomId, navigate]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black overflow-hidden"
    />
  );
};

export default CallPage;