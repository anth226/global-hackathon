import { Skeleton } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import "../../styles/room/room.css";

export default function AvailableRooms() {
  const [rooms, setrooms] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rooms/")
      .then((data) => {
        setrooms(data.data.rooms);
      })
      .catch((er) => console.error(er))
      .finally(() => setisLoading(false));
  }, []);

  return (
    <Container>
      <div className="pb-5">
        <h2 className="py-2">Current rooms to join</h2>
        <div className="row">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div className="p-2 col-12 col-md-6 col-lg-4">
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
