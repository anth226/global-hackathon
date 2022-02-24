import React, { useState, useEffect } from "react";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import { Footer, Header } from "../../components/template";
import { connect, Room as VideoRoom } from "twilio-video";
import { Container } from "reactstrap";
import Room from "./Room";

export default function RoomPage() {
  const { search } = useLocation();
  const history = useHistory();
  const token = new URLSearchParams(search).get("token");

  const [room, setroom] = useState(null);
  const [parentSid, setParentSid] = useState(null);

  if (!token) {
    history.goBack();
  }

  useEffect(() => {
    initiate();
  }, []);

  const initiate = async () => {
    try {
      const videoRoom = await connect(token, {
        audio: true,
        video: { width: 900, height: 500 },
      });

      // Save this video room in the state
      setroom(videoRoom);
      setParentSid(videoRoom.sid);
    } catch (err) {
      console.error(err);
      alert("Error occurred trying to join meeting...");
    }
  };

  const leaveRoom = async (hard = false) => {
    if (room) {
      // Detach and remove all the tracks
      room.localParticipant.tracks.forEach((publication) => {
        if (
          publication.track.kind === "audio" ||
          publication.track.kind === "video"
        ) {
          publication.track.stop();
          const attachedElements = publication.track.detach();
          attachedElements.forEach((element) => element.remove());
        }
      });

      room.disconnect();
      if (hard) history.goBack();
      setroom(null);
    }
  };

  return (
    <React.Fragment>
      <Header />
      <div className="py-5">
        <Container>
          <div className="py-5">
            {room ? (
              <Room
                room={room}
                breakoutRoomList={[]}
                parentSid={parentSid}
                leaveRoom={leaveRoom}
              />
            ) : (
              <div className="bg-black w-75 h-100 d-flex justify-content-center align-items-center">
                <img src="/images/rolling.gif" width={80} />
              </div>
            )}
          </div>
        </Container>
      </div>
      <Footer />
    </React.Fragment>
  );
}
