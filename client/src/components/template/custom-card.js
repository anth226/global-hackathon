import React from "react";
import {
  LikeOutlined,
  LinkedinOutlined,
  FacebookFilled,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";

const SocialLinks = (props) => (
  <span>
    {props.linkedin && <LinkedinOutlined />}
    {props.facebook && <FacebookFilled />}
    {props.twitter && <TwitterOutlined />}
    {props.web && <UserOutlined />}
  </span>
);

const CustomCard = (props) => {
  if (!props.columns || props.columns === 4)
    return (
      <div className="custom-card mt-4">
        {props.logo && <img src={props.logo} alt="logo" />}
        <h5>{props.title}</h5>
        <p>{props.description}</p>
        <SocialLinks {...props} />
        <p className="custom-card-footer">{props.status}</p>
        {props.likes > 0 && (
          <p className="custom-card-like">
            <LikeOutlined /> <span>{props.likes}</span>
          </p>
        )}
        {props.flag && (
          <img
            className="card-badge"
            src={props.flag}
            title={props.location}
            alt=""
          />
        )}
      </div>
    );
  return (
    <div className="wide-card mt-4">
      <div className="flex">
        <div className="wide-card-img">
          {props.logo && <img src={props.logo} alt="" />}
        </div>
        <div className="wide-card-desc">
          <h4>
            <b className="mr-4">{props.title}</b>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                float: "right",
                paddingTop: "8px",
              }}
            >
              {props.location}
            </span>
            {props.flag && (
              <img
                className="card-badge"
                src={props.flag}
                title={props.location}
                alt=""
              />
            )}
          </h4>
          <p>{props.description}</p>
          <SocialLinks {...props} />
        </div>
      </div>
      <p className="custom-card-footer">{props.status}</p>
      {props.likes > 0 && (
        <p className="custom-card-like">
          <LikeOutlined /> <span>{props.likes}</span>
        </p>
      )}
    </div>
  );
};

export default CustomCard;
