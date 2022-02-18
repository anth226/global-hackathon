import React from "react";
import ProjectAvatar from "../../assets/icon/challenge.png";
import { LikeOutlined } from "@ant-design/icons";

const ChallengeCard = (props) => {
  const { item, button, label } = props;
  if (button) {
    return (
      <div
        className="custom-card"
        style={{
          backgroundImage: "linear-gradient(#404668, #151d4d, #1a245d)",
          color: "white",
          padding: 20,
        }}
      >
        <p style={{ fontSize: "14px" }}>JOIN IN</p>
        <div className="mb-4" />
        <p style={{ fontSize: "14px" }}>{label}</p>
        <div className="mb-4" />
        <button
          className="btn-custom-card mt-4"
          onClick={() => props.onClickCreate()}
        >
          Create
        </button>
      </div>
    );
  }
  return (
    <div className="custom-card">
      <img src={item.logo || ProjectAvatar} alt="logo" height={40} />
      <h5>{item.challenge_name}</h5>
      <p>{item.short_description}</p>
      <p className="custom-card-footer">
        {item.projects || 0} {props.label.project} {!item.public && "(pending)"}
      </p>
      {item.likes && item.likes.length > 0 && (
        <p className="custom-card-like">
          <LikeOutlined /> <span>{item.likes.length}</span>
        </p>
      )}
    </div>
  );
};

export default ChallengeCard;
