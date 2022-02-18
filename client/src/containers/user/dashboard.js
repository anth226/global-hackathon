import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { MailOutlined } from "@ant-design/icons";
import {
  Alert,
  Skeleton,
  Button,
  Descriptions,
  Modal,
  Tabs,
  Input,
} from "antd";
import { Header, Footer } from "../../components/template";
import sampleUrl from "../../assets/img/user-avatar.png";
import history from "../../history";
import { Link } from "react-router-dom";
import LocationModal from "../location";
import Invites from "./invite";
import MessageTab from "./message";
import { startConversation, fetchOneConversation } from "../../actions/message";
import { updateUserLocation, protectedTest } from "../../actions/auth";
import { getRule } from "../../actions/rule";
import { listLocation } from "../../actions/location";
import { ChooseHostForm } from "./profile-form";
const { TabPane } = Tabs;

class UserDashboard extends Component {
  state = {
    showLocationModal: false,
    showMessageModal: false,
    chatText: "",
    showChooseHostModal: false,
    agreedRule: false,
    loaded: false,
  };

  componentDidMount = async () => {
    const { listLocation, getRule, user } = this.props;
    await listLocation();
    await sleep(1000);
    if (user._id) {
      const rule = await getRule(user._id);
      this.setState({ agreedRule: !!rule });
    }
    this.setState({ loaded: true });
  };

  toggleLocationModal = () => {
    this.setState({ showLocationModal: !this.state.showLocationModal });
  };

  toggleChooseHostModal = () => {
    this.setState({ showChooseHostModal: !this.state.showChooseHostModal });
  };

  haveChat = (userId) => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      let filters = cv.participants.filter((pt) => pt._id === userId) || [];
      if (filters.length > 0 && cv.participants.length === 2) return true;
    }
    return false;
  };

  onOpenChat = async (hostId) => {
    if (this.haveChat(hostId)) {
      await this.props.fetchOneConversation(hostId);
      history.push("/message");
      return;
    }
    this.setState({ showMessageModal: true });
  };

  onHideChatModal = () => {
    this.setState({ showMessageModal: false });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText } = this.state;
    const hostId = this.props.user.profile.location.creator;
    if (!chatText || !hostId) return;
    this.props.startConversation({
      recipient: hostId,
      composedMessage: chatText,
    });
    this.onHideChatModal();
  };

  onSelectLocation = async (locationId) => {
    const { user, updateUserLocation, protectedTest } = this.props;
    await updateUserLocation(locationId, user.email);
    await protectedTest();
  };

  renderRulesAlert = () => {
    const valid = (
      <div>
        Please check Global Legal Hackathon Competition Official Rules{" "}
        <Link to="/rules" target={"_blank"}>
          here
        </Link>
      </div>
    );
    return <Alert description={valid} type="info" closable />;
  };

  render = () => {
    const { user, loc } = this.props;
    const {
      showLocationModal,
      showMessageModal,
      chatText,
      showChooseHostModal,
      loaded,
      agreedRule,
    } = this.state;
    const userInfo = user.profile;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {loaded && !agreedRule && this.renderRulesAlert()}
          <div className="user-dashboard">{this.renderUserInfo(userInfo)}</div>
          {userInfo &&
            userInfo.location_role === "Admin" &&
            userInfo.location.status === "approved" &&
            this.renderHostBlock()}
        </Container>
        {showLocationModal && (
          <Modal
            title={"Location Profile"}
            visible={showLocationModal}
            width={900}
            footer={false}
            onCancel={this.toggleLocationModal}
          >
            <LocationModal
              onNext={this.toggleLocationModal}
              location={userInfo.location}
              isAdmin={userInfo && userInfo.location_role === "Admin"}
            />
          </Modal>
        )}
        {showChooseHostModal && (
          <Modal
            title={"Choose a host"}
            visible={showChooseHostModal}
            width={600}
            footer={false}
            onCancel={this.toggleChooseHostModal}
            className="choose-host"
          >
            <ChooseHostForm
              locations={loc.locations}
              onSubmit={this.onSelectLocation}
              onClose={this.toggleChooseHostModal}
            />
          </Modal>
        )}
        {showMessageModal && (
          <Modal
            title={`Open Chat room with the host`}
            visible={showMessageModal}
            onOk={this.handleOk}
            onCancel={this.onHideChatModal}
          >
            <Input.TextArea
              rows={2}
              onChange={this.onChangeChat}
              value={chatText}
              placeholder="Message"
            />
          </Modal>
        )}
        <Footer />
      </React.Fragment>
    );
  };

  renderUserInfo = (userInfo) => {
    if (!userInfo) {
      return this.renderSpin();
    }
    const usertype =
      userInfo.location_role === "Admin" ? "Host" : "Participant";
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="user-card">
            <img src={userInfo.photo || sampleUrl} alt="" />
          </div>
          <div className="mt-4 center">
            <Button type="primary" onClick={() => history.push("/blockchain")}>
              Blockchain Information
            </Button>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h4>
            {userInfo.first_name} {userInfo.last_name}
          </h4>
          <div className="usertype">
            {usertype} <div className="bullet" />
          </div>
          <h5>
            <b>Location information</b>
          </h5>
          {userInfo.location && (
            <Descriptions column={2}>
              <Descriptions.Item label="Venue">
                {userInfo.location.venue}
              </Descriptions.Item>
              <Descriptions.Item label="Organization">
                {userInfo.location.organization}
              </Descriptions.Item>
              <Descriptions.Item label="Venue Country">
                {userInfo.location.venue_country}
              </Descriptions.Item>
              <Descriptions.Item label="Venue City">
                {userInfo.location.venue_city}
              </Descriptions.Item>
              <Descriptions.Item label="Venue Street">
                {userInfo.location.venue_street}
              </Descriptions.Item>
              <Descriptions.Item label="Venue Zipcode">
                {userInfo.location.venue_zip}
              </Descriptions.Item>
            </Descriptions>
          )}
          {!userInfo.location && (
            <React.Fragment>
              <Descriptions column={2}>
                <Descriptions.Item label="Country">
                  {userInfo.country}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {userInfo.city}
                </Descriptions.Item>
              </Descriptions>
              <Button
                type="primary"
                onClick={this.toggleChooseHostModal}
                className="mt-2"
              >
                Choose a host
              </Button>
            </React.Fragment>
          )}
          {usertype === "Host" && (
            <Link
              className="view-more"
              to="#"
              onClick={this.toggleLocationModal}
            >
              View More
            </Link>
          )}
          {userInfo.location_role === "Admin" &&
            userInfo.location.status !== "approved" && (
              <Alert
                message="Your location is in pending status, we are reviewing your submission"
                type="info"
                closable
                className="mt-4"
              />
            )}
          {usertype !== "Host" && userInfo.location && (
            <Link
              to="#"
              className="chat-host"
              onClick={() => this.onOpenChat(userInfo.location.creator)}
            >
              Contact Host <MailOutlined />
            </Link>
          )}
        </Col>
      </Row>
    );
  };

  renderHostBlock = () => {
    const { user } = this.props;
    return (
      <Tabs defaultActiveKey="1" type="card" size="large" className="mt-5">
        <TabPane tab="Manage Participants" key="1">
          {user.profile && <Invites />}
          {!user.profile && <h5 className="mt-5">Loading...</h5>}
        </TabPane>
        <TabPane tab="Communicate" key="2">
          <MessageTab />
        </TabPane>
      </Tabs>
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mapStateToProps = (state) => {
  return {
    message: state.message,
    user: state.user.profile,
    loc: state.loc,
  };
};

export default connect(mapStateToProps, {
  startConversation,
  fetchOneConversation,
  updateUserLocation,
  protectedTest,
  listLocation,
  getRule,
})(UserDashboard);
