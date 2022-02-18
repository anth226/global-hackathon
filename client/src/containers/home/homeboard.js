import React from "react";
import WorldMap from "../../assets/img/home-lg.svg";

const HomeBoard = ({ empty }) => (
  <div className="home-board">
    {!empty && <img className="home-bg" src={WorldMap} alt="" />}
  </div>
);

export default HomeBoard;
