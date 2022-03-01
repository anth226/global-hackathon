import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Footer } from "../../components/template";
import { Row } from "antd";
import { getMeetingInfo } from "../../actions/meeting";
import VideoComponent from "./video-component";

class AttendMeeting extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { getMeetingInfo, match } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    // await getMeetingInfo(match.params.token);
    if (!this._isMounted) return;
    this.setState({ loading: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render = () => {
    const { user, auth } = this.props;

    return (
      <React.Fragment>
        <Header />
        <Row>
          <Row
            xl={4}
            md={5}
            className="mb-3 mx-auto"
            style={{ paddingTop: "100px", minHeight: "90vh" }}
          >
            <VideoComponent id={this.props.match.params.token}></VideoComponent>
          </Row>
        </Row>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    fieldData: state.profile.fieldData,
    loginMode: state.auth.loginMode,
  };
};

export default connect(mapStateToProps, {
  getMeetingInfo,
})(AttendMeeting);
