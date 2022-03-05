import axios from "axios";
import React, { useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { message } from "antd";

export default function CreateRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [roomName, setroomName] = useState("");

  const { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_HOST}/rooms/main`, {
        roomName,
        projectId: id,
      })
      .then((data) => {
        setroomName("");
        message.success("Room created successfully");
      })
      .catch((err) => {
        message.error("Error occurred creating a room");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Container>
      <div className="py-5">
        <h2 className="py-2">Create new room</h2>
        <form onSubmit={handleSubmit}>
          <label>Enter room name</label>
          <input
            className="d-block border py-2 px-3 w-50 text-left"
            value={roomName}
            placeholder="Room name"
            required
            onChange={(event) => {
              setroomName(event.target.value);
            }}
          />
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary mt-2"
            >
              Create room
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
