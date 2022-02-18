import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { message, Input, List, Avatar, Popconfirm, Modal, Tooltip } from "antd";
import { CopyOutlined, MailOutlined } from "@ant-design/icons";
import { listLocationUsers, hostVerifyUser } from "../../actions/location";
import sampleUrl from "../../assets/img/user-avatar.png";
import { ModalSpinner } from "../../components/pages/spinner";
import { Link } from "react-router-dom";
import { startConversation, fetchOneConversation } from "../../actions/message";
import history from "../../history";

const mainInvURL = "https://glh2022.globallegalhackathon.com/identity-register";

class Invites extends Component {
  state = {
    loading: false,
    participant: {},
    showUserProfile: false,
    showMessageModal: false,
    chatText: "",
  };

  componentDidMount = () => {
    const { user, listLocationUsers } = this.props;
    if (!user.profile) return;
    const location = user.profile.location;
    listLocationUsers(location._id);
  };

  haveChat = (userId) => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      let filters = cv.participants.filter((pt) => pt._id === userId) || [];
      if (filters.length > 0 && cv.participants.length === 2) return true;
    }
    return false;
  };

  onVerifyUser = async (user_id) => {
    const { user, listLocationUsers, hostVerifyUser } = this.props;
    this.setState({ loading: true });
    await hostVerifyUser(user_id);
    const location = user.profile.location;
    await listLocationUsers(location._id);
    this.setState({ loading: false });
  };

  copyLink = (value) => {
    navigator.clipboard.writeText(value);
    message.success("Copied!");
  };

  onOpenProfile = (user) => {
    this.setState({ participant: user, showUserProfile: true });
  };

  onHideProfile = () => {
    this.setState({ participant: {}, showUserProfile: false });
  };

  onOpenChat = async (user) => {
    if (this.haveChat(user._id)) {
      await this.props.fetchOneConversation(user._id);
      history.push("/message");
      return;
    }
    this.setState({ participant: user, showMessageModal: true });
  };

  onHideChatModal = () => {
    this.setState({ participant: {}, showMessageModal: false });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText } = this.state;
    if (!chatText) return;
    this.props.startConversation({
      recipient: this.state.participant._id,
      composedMessage: chatText,
    });
    this.onHideChatModal();
  };

  renderUserProfile = () => {
    const { participant } = this.state;
    const userInfo = participant.profile || {};
    return (
      <Row>
        <Col md={5} className="mb-3">
          <div className="user-card">
            <img src={userInfo.photo || sampleUrl} alt="" />
          </div>
        </Col>
        <Col md={7}>
          <h3 className="mb-4">
            {userInfo.first_name} {userInfo.last_name}
          </h3>
          <div className="user-span">
            <p>Email:</p>
            <span>{participant.email}</span>
          </div>
          {userInfo.country && (
            <div className="user-span">
              <p>Country:</p>
              <span>{userInfo.country}</span>
            </div>
          )}
          {userInfo.address && (
            <div className="user-span">
              <p>Address:</p>
              <span>{userInfo.address}</span>
            </div>
          )}
          {userInfo.contact && (
            <div className="user-span">
              <p>Best way to contact:</p>
              <span>{userInfo.contact}</span>
            </div>
          )}
          {userInfo.position && (
            <div className="user-span">
              <p>Position:</p>
              <span>{userInfo.position}</span>
            </div>
          )}

          <div
            className="sun-editor-editable mt-4"
            dangerouslySetInnerHTML={{ __html: userInfo.personal_statement }}
          />
          <div className="social-icon">
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

  render = () => {
    const { user, loc } = this.props;
    const { showUserProfile, showMessageModal, chatText } = this.state;
    const location = user.profile ? user.profile.location : {};
    const referLink = `${mainInvURL}?inv_id=${location._id}`;
    const hosted_users = loc.hosted_users || [];
    const verified_users = hosted_users.filter(
      (item) => item.profile.host_verified
    );
    const unverified_users = hosted_users.filter(
      (item) => !item.profile.host_verified
    );
    return (
      <div className="inv-box">
        <h5>
          Copy this url and send to your participants so they can register
        </h5>
        <span>
          This link enables participants to register exclusively with you as the
          host
        </span>
        <br />
        <Input
          placeholder={referLink}
          size="large"
          suffix={<CopyOutlined onClick={() => this.copyLink(referLink)} />}
          disabled
        />
        <span className="invite-title">Approved Participants</span>
        <List
          itemLayout="horizontal"
          dataSource={verified_users}
          className="approved-users"
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.profile.photo || sampleUrl} />}
                title={
                  <div className="user-list">
                    <Link to="#" onClick={() => this.onOpenProfile(item)}>
                      {item.profile.first_name} {item.profile.last_name}
                    </Link>
                    <Tooltip title="Chat">
                      <Link
                        to="#"
                        className="mailbox"
                        onClick={() => this.onOpenChat(item)}
                      >
                        <MailOutlined />
                      </Link>
                    </Tooltip>
                  </div>
                }
                description={item.email}
              />
            </List.Item>
          )}
        />
        <span className="invite-title">Pending Participants</span>
        <List
          itemLayout="horizontal"
          dataSource={unverified_users}
          className="pending-users"
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Are you sure approve this user?"
                  onConfirm={() => this.onVerifyUser(item._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Link to="#">Approve</Link>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.profile.photo || sampleUrl} />}
                title={
                  <div className="user-list">
                    <Link to="#" onClick={() => this.onOpenProfile(item)}>
                      {item.profile.first_name} {item.profile.last_name}
                    </Link>
                    <Tooltip title="Chat">
                      <Link
                        to="#"
                        className="mailbox"
                        onClick={() => this.onOpenChat(item)}
                      >
                        <MailOutlined />
                      </Link>
                    </Tooltip>
                  </div>
                }
                description={item.email}
              />
            </List.Item>
          )}
        />
        {showUserProfile && (
          <Modal
            title={"Participant Profile"}
            visible={showUserProfile}
            width={900}
            footer={false}
            onCancel={this.onHideProfile}
          >
            {this.renderUserProfile()}
          </Modal>
        )}
        {showMessageModal && (
          <Modal
            title={`Open Chat room with participant`}
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
        <ModalSpinner visible={this.state.loading} />
      </div>
    );
  };
}
const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    loc: state.loc,
    message: state.message,
  };
};

export default connect(mapStateToProps, {
  listLocationUsers,
  hostVerifyUser,
  startConversation,
  fetchOneConversation,
})(Invites);
