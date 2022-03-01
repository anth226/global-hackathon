import React from "react";
import "./rooms-display.module.css";
import { Footer, Header } from "../../components/template";
import CreateRoom from "./create-room";
import AvailableRooms from "./rooms-list";

function RoomsDisplay() {
  // useEffect(() => {
  //   // Clean up the listeners when the component is about to unmount.
  //   return () => {
  //     if (socket) {
  //       socket.off("Main room created");
  //       socket.off("Breakout room created");
  //     }
  //   };
  // }, []);

  return (
    <React.Fragment>
      <div className="h-screen">
        <Header title="Project chat rooms" />
        <div className="pt-5">
          <CreateRoom />
        </div>
        <AvailableRooms />
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default RoomsDisplay;
