import { Header } from "antd/lib/layout/layout";
import axios from "axios";
import React, { useState } from "react";
import { Container } from "reactstrap";
import { Footer } from "../../components/template";

export default function CreateRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [roomName, setroomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("http://localhost:8080/api/rooms/main", { roomName })
      .then((data) => {
        setroomName("");
        window.alert("Room created successfully");
      })
      .catch((err) => {
        window.alert("Error occurred creating a room");
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
