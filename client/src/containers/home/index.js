import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Header } from "../../components/template";
import { PlayCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { protectedTest } from "../../actions/auth";
import history from "../../history";

class HomePage extends Component {
  state = {
    showPromoVideoModal: false,
  };

  componentDidMount = async () => {
    if (this.props.user._id) {
      history.push("/dashboard");
    } else {
      await this.props.protectedTest();
      await sleep(100);
      if (this.props.user._id) {
        history.push("/dashboard");
      }
    }
  };

  togglePromoVideoModal = () => {
    this.setState({ showPromoVideoModal: !this.state.showPromoVideoModal });
  };

  render() {
    const { showPromoVideoModal } = this.state;
    return (
      <React.Fragment>
        <Header />
        <video autoPlay muted loop id="myVideo">
          <source
            src="https://glh2021.s3.us-east-2.amazonaws.com/0579f052-1d12-4175-82a8-8c8cf25542af.mp4"
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>
        <div className="main-board">
          <div className="home-mobile-title">
            <div className="super-title">#GLH2022</div>
            <span className="yellow-title">World's Largest</span>
            <span className="normal-title">Legal Hackathon</span>
          </div>
          <div className="home-title container">
            <div className="home-super-title">#GLH2022</div>
            <div className="home-title-big">
              <span className="yellow-title">World's Largest</span>
              <span className="normal-title">Legal Hackathon</span>
            </div>
            <div className="home-title-desc">
              Mark your calendars. March 25 - 27th 2022
            </div>
          </div>
          <div className="btn-box">
            <div className="home-btns">
              <Link to="/identity-register" className="mr-3">
                Register
              </Link>
              <Link to="/identity">Login</Link>
            </div>
            <Link
              to="#"
              className="video-btn"
              onClick={this.togglePromoVideoModal}
            >
              <PlayCircleFilled /> Play the video
            </Link>
          </div>
        </div>
        {showPromoVideoModal && (
          <Modal
            visible={showPromoVideoModal}
            width={700}
            centered
            footer={false}
            onCancel={this.togglePromoVideoModal}
            className="instruct_modal"
          >
            <div className="instruct-item">
              <iframe
                src="https://player.vimeo.com/video/651294945?h=37cf3bdbcc"
                title="promo video"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
              ></iframe>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, {
  protectedTest,
})(HomePage);
