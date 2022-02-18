import React, { Component } from "react";
import ReactPlayer from "react-player";

class Video extends Component {
  render() {
    return (
        <ReactPlayer
          className="react-player"
          url={this.props.url}
          playing={false}
          controls={true}
          loop={true}
        />
    );
  }
}

export default Video;
