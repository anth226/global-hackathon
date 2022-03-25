import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import {
  Avatar,
  Skeleton,
  Modal,
  Input,
  Button,
  Dropdown,
  Menu,
  Popover,
} from "antd";
import {
  DownOutlined,
  FlagOutlined,
  UserDeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getProjectsByUser, listProjectByCreator } from "../../actions/project";
import { getUser } from "../../actions/auth";
import { startConversation, fetchOneConversation } from "../../actions/message";
import { restrictUser, blockUser, reportUser } from "../../actions/user";
import { Header, Footer, CustomCard } from "../../components/template";
import sampleUrl from "../../assets/img/user-avatar.png";
import ProjectAvatar from "../../assets/icon/challenge.png";
import history from "../../history";
import AttrBlock from "../../components/pages/attr-block";
// import UserChallenges from "./challenges";
import DashboardBadge from "../../components/pages/dashboard-badge";

class UserDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      joinProjects: [],
      createdProjects: [],
      loading: false,
      visible: false,
      chatText: "",
      reportText: "",
      reportShow: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const userId = this.props.match.params.id;
    const { getProjectsByUser, listProjectByCreator, getUser } = this.props;

    const joinProjects = await getProjectsByUser(userId);
    const createdProjects = await listProjectByCreator(userId);
    const user = await getUser(userId);
    this.setState({
      joinProjects: joinProjects || [],
      createdProjects: createdProjects || [],
      user,
      loading: false,
    });
  };

  haveChat = () => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      let filters =
        cv.participants.filter((pt) => pt._id === this.props.match.params.id) ||
        [];
      if (filters.length > 0 && cv.participants.length === 2) return true;
    }
    return false;
  };

  toggleModal = async () => {
    if (this.haveChat()) {
      await this.props.fetchOneConversation(this.props.match.params.id);
      history.push("/message");
      return;
    }
    this.setState({ visible: !this.state.visible });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText } = this.state;
    if (!chatText) return;
    this.props.startConversation({
      recipient: this.props.match.params.id,
      composedMessage: chatText,
    });
    this.toggleModal();
  };

  mkReportMenu = (userId) => (
    <Menu>
      <Menu.Item key="1" onClick={() => this.props.restrictUser(userId)}>
        <ExclamationCircleOutlined />
        <span>Restrict</span>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => this.props.blockUser(userId)}>
        <UserDeleteOutlined />
        <span>Block</span>
      </Menu.Item>
    </Menu>
  );

  isMyBlocker = () => {
    let blockers = this.props.user.blockers || [];
    for (let b of blockers) {
      if (b === this.props.match.params.id) return true;
    }
    return false;
  };

  onChangeReport = (e) => {
    this.setState({ reportText: e.target.value });
  };

  onChangeReportShow = (visible) => {
    this.setState({ reportShow: visible });
  };

  reportUser = () => {
    this.props.reportUser(this.props.match.params.id, this.state.reportText);
    this.setState({ reportShow: false, reportText: "" });
  };

  render = () => {
    const { user, visible, chatText } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {user && (
            <div className="user-dashboard">
              {this.renderUserInfo(user)}
              {this.renderCreatedProjects()}
              {this.renderMemberProjects()}
              {this.renderFollowingProjects()}
              {/* <UserChallenges userId={this.props.match.params.id} /> */}
            </div>
          )}
          <Modal
            title={`Open Chat room with ${this.props.label.titleParticipant}`}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.toggleModal}
          >
            <Input.TextArea
              rows={2}
              onChange={this.onChangeChat}
              value={chatText}
              placeholder="Message"
            />
          </Modal>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderUserInfo = (userData) => {
    const { user, isAdmin, fieldData, isJudge } = this.props;
    const userInfo = userData.profile;
    const judgeUser = userData.role === "judge";
    if (!userInfo) {
      return this.renderSpin();
    }
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="user-card">
            <Avatar src={userInfo.photo || sampleUrl} size={200} />
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h3>
            {userInfo.first_name} {userInfo.last_name}
            <DashboardBadge referred={userInfo.referred} />
          </h3>
          <p className="mt-4">
            <b style={{ fontSize: "13px" }}>{userInfo.country || ""}</b>
          </p>
          <p className="mt-4">
            <b style={{ fontSize: "13px" }}>
              Host Location: {userInfo.location?.venue || ""}
            </b>
          </p>
          <div
            className="sun-editor-editable mt-4"
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
          <p  className="mt-4">
            <b>Contact:&nbsp;&nbsp;</b>
            <span>{userInfo.contact}</span>
          </p>
          <AttrBlock
            fieldData={fieldData}
            fieldName={"userform_attr"}
            attr={userInfo.attr}
          />

          {user._id !== this.props.match.params.id && !isJudge && !judgeUser && (
            <div className="flex" style={{ justifyContent: "space-between" }}>
              {!this.isMyBlocker() && (
                <Button type="primary" onClick={this.toggleModal}>
                  Send Message
                </Button>
              )}
              {isAdmin &&
                (userData.role === "Restrict" || userData.role === "Block") && (
                  <Button type="default" disabled>
                    {userData.role}
                  </Button>
                )}
              {isAdmin &&
                userData.role !== "Restrict" &&
                userData.role !== "Block" && (
                  <Dropdown
                    overlay={this.mkReportMenu(this.props.match.params.id)}
                    trigger={["click"]}
                  >
                    <Button>
                      <FlagOutlined /> <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
              {!isAdmin && (
                <Popover
                  content={this.renderReportContent()}
                  title="Report User"
                  trigger="click"
                  visible={this.state.reportShow}
                  onVisibleChange={this.onChangeReportShow}
                >
                  <Button title="report">
                    <FlagOutlined />
                  </Button>
                </Popover>
              )}
            </div>
          )}
        </Col>
      </Row>
    );
  };

  renderReportContent = () => (
    <div>
      <Input.TextArea
        rows={2}
        onChange={this.onChangeReport}
        value={this.state.reportText}
      />
      <Button className="mt-2" type="primary" onClick={this.reportUser}>
        Submit
      </Button>
    </div>
  );

  renderCreatedProjects = () => {
    const { createdProjects } = this.state;
    if (createdProjects.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">{this.props.label.titleProject} Created</h5>
        {this.renderSpin()}
        <Row>
          {createdProjects.map((item, index) => (
            <Col key={index} lg={4} md={6} sm={12}>
              <Link className="card-link" to={`/project/${item._id}`}>
                <CustomCard
                  logo={item.logo || ProjectAvatar}
                  title={item.name}
                  description={item.short_description}
                  likes={item.likes ? item.likes.length : 0}
                />
              </Link>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  };

  renderMemberProjects = () => {
    const { joinProjects } = this.state;
    const listItem = joinProjects.filter((item) => item.member === true);
    if (listItem.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">{this.props.label.titleProject} Team Member</h5>
        {this.renderSpin()}
        <Row>
          {listItem.map((item, index) => {
            return (
              <Col key={index} lg={4} md={6} sm={12}>
                <Link className="card-link" to={`/project/${item.project._id}`}>
                  <CustomCard
                    logo={item.project.logo || ProjectAvatar}
                    title={item.project.name}
                    description={item.project.short_description}
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </React.Fragment>
    );
  };

  renderFollowingProjects = () => {
    const { joinProjects } = this.state;
    const listItem = joinProjects.filter((item) => item.member !== true);
    if (listItem.length === 0) return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">{this.props.label.titleProject} Followed</h5>
        {this.renderSpin()}
        <Row>
          {listItem.map((item, index) => {
            return (
              <Col key={index} lg={4} md={6} sm={12}>
                <Link className="card-link" to={`/project/${item.project._id}`}>
                  <CustomCard
                    logo={item.project.logo || ProjectAvatar}
                    title={item.project.name}
                    description={item.project.short_description}
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </React.Fragment>
    );
  };

  renderSpin = () => {
    return (
      <Row>
        <Col className="center">
          <Skeleton active loading={this.state.loading} />
        </Col>
      </Row>
    );
  };
}
const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    isJudge: state.user.isJudge,
    message: state.message,
    label: state.label,
    fieldData: state.profile.fieldData,
  };
};

export default connect(mapStateToProps, {
  getProjectsByUser,
  listProjectByCreator,
  getUser,
  startConversation,
  restrictUser,
  blockUser,
  fetchOneConversation,
  reportUser,
})(UserDashboard);
