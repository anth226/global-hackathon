import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import Participant from "./Participant";

import { io } from "socket.io-client";

const Room = ({ room, breakoutRoomList, parentSid, joinRoom, leaveRoom }) => {
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
    socket.on("Breakout room created", () => getBreakouts());

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
      })
      .catch((err) => {
        window.alert("Error occurred creating a room");
      })
      .finally(() => setisModalOpen(false));
  }

  return (
    <div className="room">
      <h3 className="px-2">{room.name} room</h3>
      <div className="participants">
        <Participant
          key={room.localParticipant.identity}
          participant={room.localParticipant}
        />
        {remoteParticipants.map((participant) => (
          <Participant key={participant.identity} participant={participant} />
        ))}
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
      <div className="breakouts-list">
        {breakouts.length > 0 && <h5 className="p-2">Breakout Rooms</h5>}

        {breakouts.map((room) => {
          return (
            <button
              className="btn btn-outline-primary mx-2"
              key={room._id}
              onClick={() => changeRoom(room._id, false)}
            >
              {room.name}
            </button>
          );
        })}
      </div>
      <div className="d-flex justify-content-center">
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
        <button className="btn btn-danger" onClick={() => leaveRoom(true)}>
          Leave room
        </button>
      </div>
    </div>
  );
};

export default Room;
