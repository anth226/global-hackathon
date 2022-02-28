import { Skeleton } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { Container } from "reactstrap";
import { Footer, Header } from "../../components/template";

export default function JoinRoom() {
  const [isLoading, setisLoading] = useState(true);
  const [room, setroom] = useState(null);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    function getRoom() {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/rooms/${id}`)
        .then((data) => {
          setroom(data.data);
          setisLoading(false);
        })
        .catch((er) => console.error(er));
    }
    getRoom();
  }, []);

  const joinRoom = async (roomSid, breakout = false) => {
    let identity = Date.now().toString(36);
    alert(identity);
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
    <div>
      <Header />
      <Container>
        <div className="py-5" />
        {isLoading ? (
          <div className="p-2 col-12 col-md-6 col-lg-4 h-100">
            <Skeleton />
          </div>
        ) : (
          <div className="p-2 col-12 col-md-6 col-lg-4">
            <div className="position-relative">
              <img
                alt="Meeting avatar"
                src="https://images.pexels.com/photos/4049992/pexels-photo-4049992.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=400"
                className="d-block w-100 object-cover"
              />
              <div>
                <h6 className="p-2">{room.name}</h6>
                <button
                  className="btn btn-primary position-absolute join-btn"
                  onClick={() => joinRoom(room.sid)}
                >
                  Join room
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
