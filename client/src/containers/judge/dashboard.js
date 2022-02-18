import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Avatar, Skeleton } from "antd";
import { Header, Footer } from "../../components/template";
import sampleUrl from "../../assets/img/user-avatar.png";

class JudgeDashboard extends Component {
  render = () => {
    const { user } = this.props;
    const userInfo = user.profile;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="user-dashboard">{this.renderUserInfo(userInfo)}</div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderUserInfo = (userInfo) => {
    if (!userInfo) {
      return this.renderSpin();
    }
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="user-card mb-4">
            <Avatar src={userInfo.photo || sampleUrl} size={200} />
          </div>
          <span>Contact: {userInfo.contact}</span>
        </Col>
        <Col xl={8} md={7}>
          <h3 className="mb-4">
            <b>
              {userInfo.first_name} {userInfo.last_name}
            </b>
          </h3>
          <h5 className="mb-3">
            {userInfo.role} at {userInfo.org_name}
          </h5>
          <h5 className="mb-4">{userInfo.country}</h5>
          <div
            className="sun-editor-editable mb-5"
            dangerouslySetInnerHTML={{ __html: userInfo.personal_statement }}
          />
          <div className="social-icon d-flex">
            {userInfo.facebook && (
              <a
                href={userInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/facebook.png")}
                  alt="facebook"
                />
              </a>
            )}
            {userInfo.twitter && (
              <a
                href={userInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/twitter.png")}
                  alt="twitter"
                />
              </a>
            )}
            {userInfo.linkedin && (
              <a
                href={userInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={require("../../assets/icon/linkedin.png")}
                  alt="linkedin"
                />
              </a>
            )}
            {userInfo.web && (
              <a href={userInfo.web} target="_blank" rel="noopener noreferrer">
                <img
                  src={require("../../assets/icon/challenge.png")}
                  alt="web"
                />
              </a>
            )}
          </div>
        </Col>
      </Row>
    );
  };

  renderSpin = () => {
    return (
      <Row>
        <Col className="center">
          <Skeleton active loading={true} />
        </Col>
      </Row>
    );
  };
}
const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {})(JudgeDashboard);
