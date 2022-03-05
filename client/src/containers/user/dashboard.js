import { MailOutlined } from "@ant-design/icons";
import {
  Alert, Button,
  Descriptions, Input, Modal, Skeleton, Tabs
} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { protectedTest, updateUserLocation } from "../../actions/auth";
import { createOtherLocation, listLocation } from "../../actions/location";
import { fetchOneConversation, startConversation } from "../../actions/message";
import { getRule } from "../../actions/rule";
import sampleUrl from "../../assets/img/user-avatar.png";
import { Footer, Header } from "../../components/template";
import history from "../../history";
import LocationModal from "../location";
import LocationForm from "../location/location-form";
import Invites from "./invite";
import MessageTab from "./message";
import { ChooseHostForm } from "./profile-form";
const { TabPane } = Tabs;

class UserDashboard extends Component {
  state = {
    showLocationModal: false,
    showCreateLocationModal: false,
    showMessageModal: false,
    selectedLocation: null,
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

  toggleLocationModal = (location) => {
    this.setState({ showLocationModal: !this.state.showLocationModal,selectedLocation:location });
  };

  toggleCreateLocationModal = () => {
    this.setState({ showCreateLocationModal: !this.state.showCreateLocationModal });
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
    const hostId = this.props.user.profile.location?.creator;
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

  submitLocation = async (data) => {
    const { createOtherLocation, user } = this.props;
    await createOtherLocation(data, user.email);
    this.toggleCreateLocationModal();
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
      showCreateLocationModal,
      showMessageModal,
      selectedLocation,
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
            userInfo.location?.status === "approved" &&
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
              location={selectedLocation}
              isAdmin={userInfo && userInfo.location_role === "Admin"}
            />
          </Modal>
        )}
        {showCreateLocationModal && (
          <Modal
            title={"Add Location"}
            visible={showCreateLocationModal}
            width={900}
            footer={false}
            onCancel={this.toggleCreateLocationModal}
          >
            <LocationForm onSubmit={this.submitLocation} location={{}} />
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
    const is_multi_city = userInfo?.location?.multi_city === "Yes";
    const usertype =
      userInfo.location_role === "Admin" ? "Host" : "Participant";

    const displayLocations = [
      userInfo.location,
      ...(is_multi_city ? userInfo.other_locations : []),
    ];
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
          {displayLocations.map((location, index) => (
            <div
              style={{
                borderBottom:
                  index < displayLocations.length - 1 ? "1px solid gray" : "",
                marginBottom: 40,
                paddingBottom: 10,
              }}
            >
              <Descriptions column={2}>
                <Descriptions.Item label="Venue">
                  {location?.venue || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Organization">
                  {location?.organization || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Venue Country">
                  {location?.venue_country || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Venue City">
                  {location?.venue_city || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Venue Street">
                  {location?.venue_street || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Venue Zipcode">
                  {location?.venue_zip || "N/A"}
                </Descriptions.Item>
              </Descriptions>
              {!location && (
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
                  onClick={() => this.toggleLocationModal(location)}
                >
                  View More
                </Link>
              )}
              {userInfo.location_role === "Admin" &&
                location?.status !== "approved" && (
                  <Alert
                    message="Your location is in pending status, we are reviewing your submission"
                    type="info"
                    closable
                    className="mt-4"
                  />
                )}
              {usertype === "Host" && location && (
                <Link
                  to="#"
                  className="chat-host"
                  onClick={() => this.onOpenChat(location?.creator)}
                >
                  Contact Host <MailOutlined />
                </Link>
              )}
              {userInfo.location_role === "Admin" && (
                <Link
                  to={`/locations/${location?._id}`}
                  className="btn btn-primary mt-3"
                  onClick={() => this.onOpenChat(location?.creator)}
                >
                  Go to location page
                </Link>
              )}
            </div>
          ))}
          {usertype === "Host" && is_multi_city && (
            <Button type="primary" onClick={this.toggleCreateLocationModal}>
              Add Location
            </Button>
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
  createOtherLocation
})(UserDashboard);
