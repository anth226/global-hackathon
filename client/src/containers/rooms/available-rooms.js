import { Skeleton } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container } from "reactstrap";
import { io } from "socket.io-client";
import "../../styles/room/room.css";

export default function AvailableRooms() {
  const history = useHistory();

  const [rooms, setrooms] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const socket = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:8080",
      {
        transports: ["websocket"],
      }
    );

    // Listen for events
    socket.on("Main room created", () => fetchRooms());
    fetchRooms();
  }, []);

  function fetchRooms() {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/rooms`)
      .then((data) => {
        setrooms(data.data.rooms);
      })
      .catch((er) => console.error(er))
      .finally(() => setisLoading(false));
  }

  const joinRoom = async (roomSid, breakout = false) => {
    let identity = "sandbergjacquyes";
    try {
      // Fetch an access token from the server
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/rooms/token`,
        {
          identity,
          roomSid,
        }
      );

      history.push(`/rooms/${roomSid}?token=${response.data.accessToken}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <div className="pb-5">
        <h2 className="py-2">Current rooms to join</h2>
        <div className="row">
          {isLoading && rooms.length === 0
            ? [1, 2, 3].map((i) => (
                <div key={i} className="p-2 col-12 col-md-6 col-lg-4">
                  <Skeleton />
                </div>
              ))
            : rooms.map((room) => (
                <div key={room._id} className="p-2 col-12 col-md-6 col-lg-4">
                  <div className="position-relative">
                    <img
                      src="https://images.pexels.com/photos/4049992/pexels-photo-4049992.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400"
                      className="d-block w-100 object-cover"
                    />
                    <div>
                      <h6 className="p-2">{room.name}</h6>
                      <button
                        className="position-absolute join-btn"
                        className="btn btn-primary"
                        onClick={() => joinRoom(room._id)}
                      >
                        Join room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </Container>
  );
}
