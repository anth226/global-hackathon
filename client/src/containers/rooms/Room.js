import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import Participant from "./Participant";
import { message } from "antd";

import { io } from "socket.io-client";

const Room = ({
  room,
  breakoutRoomList,
  parentSid,
  joinRoom,
  leaveRoom,
  unMute,
}) => {
  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );

  const [breakouts, setbreakouts] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [breakOutName, setbreakOutName] = useState("");

  // Whenever the room changes, set up listeners
  useEffect(() => {
    room.on("participantConnected", (participant) => {
      console.log(`${participant.identity} has entered the chat`);
      setRemoteParticipants((prevState) => [...prevState, participant]);
    });
    room.on("participantDisconnected", (participant) => {
      console.log(`${participant.identity} has left the chat`);
      setRemoteParticipants((prevState) =>
        prevState.filter((p) => p.identity !== participant.identity)
      );
    });

    const socket = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:8080",
      {
        transports: ["websocket"],
      }
    );

    // Listen for events
    socket.on("BREAKOUT_ROOM_CREATED", () => getBreakouts());

    getBreakouts();
  }, [room]);

  const changeRoom = async (sid, returnToMain = false) => {
    await leaveRoom();
    if (returnToMain) {
      return joinRoom(parentSid, false);
    }
    return joinRoom(sid, true);
  };

  function getBreakouts() {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/rooms/breakout/${room.sid}`)
      .then((res) => setbreakouts(res.data.breakouts))
      .catch((err) => console.error(err));
  }

  function createBreakout(e) {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_HOST}/rooms/breakout`, {
        roomName: breakOutName,
        parentSid: room?.sid,
      })
      .then((data) => {
        setbreakOutName("");
        message.success("Breakout room created");
      })
      .catch((err) => {
        message.error("Error occurred creating a room");
      })
      .finally(() => setisModalOpen(false));
  }

  function copyLink() {
    const link = `${window.origin}/rooms/join/${room.sid}`;
    navigator.clipboard.writeText(link);
    message.success("Link copied to clipboard");
  }

  return (
    <div className="room">
      <div className="row">
        <div className="col-sm-12 col-md-9">
          <h3 className="px-2">{room.name} room</h3>
          <div className="participants row">
            <div className="col-6 p-0 participant">
              <Participant
                key={room.localParticipant.identity}
                participant={room.localParticipant}
              />
            </div>
            {remoteParticipants.map((participant) => (
              <div className="col-3 p-0 participant" key={participant.identity}>
                <Participant participant={participant} />
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center pt-3">
            <button className="btn btn-info mx-2" onClick={copyLink}>
              Copy link to room
            </button>
            <button className="btn btn-primary mx-2" onClick={unMute}>
              Un mute
            </button>
            <button className="btn btn-danger" onClick={() => leaveRoom(true)}>
              Leave room
            </button>
            <button
              className="btn btn-outline-primary mx-2"
              onClick={() => setisModalOpen(true)}
            >
              Create breakout
            </button>
            {room.sid !== parentSid && (
              <button
                className="btn btn-primary mx-2"
                onClick={() => changeRoom(parentSid, true)}
              >
                Return to Main Room
              </button>
            )}
          </div>
        </div>
        <div className="breakouts-list col-sm-12 col-md-3">
          {breakouts.length > 0 && <h5 className="p-2">Breakout Rooms</h5>}

          {breakouts.map((room) => {
            return (
              <button
                className="btn btn-outline-primary mx-2"
                key={room.sid}
                onClick={() => changeRoom(room.sid, false)}
              >
                {room.name}
              </button>
            );
          })}
        </div>
      </div>
      <Modal onClosed={() => setisModalOpen(false)} isOpen={isModalOpen}>
        <div className="px-5 pt-4 pb-5">
          <h4 className="py-2">Create breakout room</h4>
          <form onSubmit={createBreakout}>
            <label>Enter room name</label>
            <input
              className="d-block border py-2 px-3 w-75 text-left"
              value={breakOutName}
              placeholder="Room name"
              required
              onChange={(event) => {
                setbreakOutName(event.target.value);
              }}
            />
            <div className="mt-2">
              <button
                type="submit"
                // disabled={isLoading}
                className="btn btn-primary mt-2"
              >
                Create breakout
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Room;
