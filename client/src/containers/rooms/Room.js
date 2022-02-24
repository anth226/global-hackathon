import React, { useEffect, useState } from "react";
import Participant from "./Participant";

const Room = ({ room, breakoutRoomList, parentSid, joinRoom, leaveRoom }) => {
  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );
  const [roomBreakouts, setroomBreakouts] = useState([]);

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
  }, [room]);

  const changeRoom = async (sid, returnToMain = false) => {
    // Disconnect fully from the room you're in currently before joining the next one
    await leaveRoom();

    if (returnToMain) {
      return joinRoom(parentSid, false);
    }
    return joinRoom(sid, true);
  };

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
      <div className="breakouts-list">
        {breakoutRoomList.length > 0 && <h5 className="p-2">Breakout Rooms</h5>}

        {breakoutRoomList.map((room) => {
          return (
            <button
              className="breakout"
              key={room._id}
              onClick={() => changeRoom(room._id, false)}
            >
              {room.name}
            </button>
          );
        })}
      </div>
      <div className="d-flex justify-content-center">
        {room.sid !== parentSid && (
          <button
            className="btn btn-primary"
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
