import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { Popconfirm, Menu, Dropdown, Modal, Input, Button } from "antd";
import { EllipsisOutlined, LikeOutlined, LikeFilled } from "@ant-design/icons";
import {
  getParticipant,
  joinProject,
  leaveProject,
} from "../../actions/project";
import { startConversation, fetchOneConversation } from "../../actions/message";
import { setCurrentGallery } from "../../actions/gallery";
import { createTeamChat } from "../../actions/message";
import ProjectAvatar from "../../assets/icon/challenge.png";
import UserAvatar from "../../assets/img/user-avatar.png";
import history from "../../history";
import EditProject from "./project-edit";
import ShareProject from "./project-share";
import Tags from "../../components/pages/tags";

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      modalContent: "",
      showContactModal: false,
      chatText: "",
      creator_id: "",
    };
  }

  componentDidMount = () => {
    const pt = this.props.curProj.participant;
    this.setState({ creator_id: pt ? pt._id : "" });
  };

  hideModal = () => {
    this.setState({ visible: false, modalContent: "" });
  };

  haveChat = () => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      let filters =
        cv.participants.filter((pt) => pt._id === this.state.creator_id) || [];
      if (filters.length > 0 && cv.participants.length === 2) return true;
    }
    return false;
  };

  toggleContactModal = async () => {
    const { user, fetchOneConversation } = this.props;
    if (user._id === this.state.creator_id) return;
    if (this.haveChat()) {
      await fetchOneConversation(this.state.creator_id);
      history.push("/message");
      return;
    }
    this.setState({ showContactModal: !this.state.showContactModal });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText, creator_id } = this.state;
    if (!chatText) return;
    this.props.startConversation({
      recipient: creator_id,
      composedMessage: chatText,
    });
    this.toggleContactModal();
  };

  joinProject = async () => {
    await this.props.joinProject(this.props.projectId);
    await this.props.getParticipant(this.props.projectId);
  };

  leaveProject = async () => {
    await this.props.leaveProject(this.props.projectId);
    await this.props.getParticipant(this.props.projectId);
  };

  checkFollowProject = () => {
    const { participants } = this.props.project;
    const { user } = this.props;

    if (!user._id) return false;
    if (!participants || participants.length === 0) return false;
    for (let p of participants) {
      if (p.participant._id === user._id) return true;
    }
    return false;
  };

  checkHaveTeamChat = () => {
    const { curProj, message } = this.props;
    let conversations = message.conversations;

    for (let cv of conversations) {
      if (cv.project && cv.project === curProj._id) {
        return true;
      }
    }
    return false;
  };

  checkIsTeamMember = () => {
    const { project, user } = this.props;
    const participants = project.participants;
    for (let pt of participants) {
      if (pt.participant._id === user._id && pt.member === true) {
        return true;
      }
    }
    return false;
  };

  onCreateGallery = () => {
    const { curProj, setCurrentGallery, toggleEditGallery } = this.props;
    let gallery = {
      project: curProj._id,
    };
    setCurrentGallery(gallery);
    toggleEditGallery();
  };

  onEditProject = () => {
    this.setState({
      visible: true,
      modalContent: "edit",
    });
  };

  onShareAccess = () => {
    this.setState({
      visible: true,
      modalContent: "share",
    });
  };

  handleUpvote = (vote) => {
    if (this.props.isCreator) return;
    this.props.upvoteProject(vote);
  };

  render() {
    const {
      curProj,
      isCreator,
      gallery,
      toggleEditGallery,
      togglePreview,
      isAdmin,
      user,
      loginMode,
      fieldData,
      label,
      isJudge,
    } = this.props;
    const { showContactModal, visible, modalContent, chatText } = this.state;
    if (!curProj.likes) curProj.likes = [];
    let creator = curProj.participant ? curProj.participant.profile : {};
    const isVoter = loginMode === 0 && curProj.likes.includes(user._id);

    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="#" onClick={this.onEditProject}>
            Edit {label.titleProject}
          </Link>
        </Menu.Item>
        {(isCreator || isAdmin) && (
          <Menu.Item>
            <Link to="#" onClick={this.onShareAccess}>
              Share Access
            </Link>
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={curProj.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
          <hr className="mt-4" />
          <div className="project-user pl-2 pr-2">
            <span>
              Created By
              {curProj.participant && (
                <Link to={`/participant/${curProj.participant._id}`}>
                  <img
                    src={creator.photo || UserAvatar}
                    alt=""
                    title={`${creator.first_name} ${creator.last_name}`}
                  />
                </Link>
              )}
            </span>
            <Link to="#" onClick={this.toggleContactModal}>
              contact
            </Link>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <div className="detail-desc">
            <div className="project-header">
              <h3>{curProj.name}</h3>
              {(isCreator ||
                isAdmin ||
                (curProj.sharers && curProj.sharers.includes(user._id))) && (
                <Dropdown
                  overlay={menu}
                  placement="bottomCenter"
                  trigger={["click"]}
                >
                  <Button color="link" className="btn-project-access">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              )}
            </div>
            {(curProj.country || curProj.city) && (
              <p className="project-address">
                {curProj.city}
                {curProj.city && curProj.country ? ", " : ""}
                {curProj.country}
              </p>
            )}
            <p>{curProj.short_description}</p>
            {/* {curProj.challenge && (
              <p className="produced-by">
                Addressing {label.titleChallenge} -{" "}
                <Link
                  className="challenge-link"
                  to={`/challenge/${curProj.challenge._id}`}
                >
                  {curProj.challenge.challenge_name}
                </Link>
              </p>
            )} */}
            <div
              className="sun-editor-editable"
              dangerouslySetInnerHTML={{ __html: curProj.description }}
            />
            <div className="flex mt-3">
              <b>Collaborators:</b>
              <span className="ml-2">{curProj.collaborators || ""}</span>
            </div>
            <Tags
              fieldData={fieldData}
              tags={curProj.tags || []}
              prefix={"project"}
            />
            <p>
              {isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(false)}>
                  <LikeFilled />
                </Link>
              )}
              {!isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(true)}>
                  <LikeOutlined />
                </Link>
              )}
              <span> {curProj.likes.length}</span>
            </p>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  // history.push(`/create-meeting/${this.props.projectId}`);
                  history.push(`/project/${curProj._id}/rooms`);
                }}
              >
                Go to break out room
              </Button>
            </div>
            {!this.checkFollowProject() &&
              !isCreator &&
              loginMode === 0 &&
              !isJudge && (
                <div>
                  <Popconfirm
                    title={`By following the ${label.project} you will be sharing your email with the ${label.project} creator. Follow ${label.project}?`}
                    onConfirm={this.joinProject}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className="hk_button mt-4">
                      Follow {label.titleProject}
                    </button>
                  </Popconfirm>
                </div>
              )}
            <div className="project-unfollow">
              {isCreator && !this.checkHaveTeamChat() && (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() =>
                    this.props.createTeamChat(curProj.name, curProj._id)
                  }
                >
                  Create Team Chat
                </Button>
              )}
              {/* {gallery.currentGallery._id && (
                <Button
                  color="link"
                  size="sm"
                  className="mr-auto"
                  onClick={() =>
                    history.push(`/gallery/${gallery.currentGallery._id}`)
                  }
                >
                  GALLERY
                </Button>
              )} */}
              {isCreator && gallery.currentGallery._id && (
                <Button
                  outline
                  color="primary"
                  size="sm"
                  className="mr-auto"
                  onClick={togglePreview}
                >
                  Preview {label.titleGallery}
                </Button>
              )}
              {isCreator && gallery.currentGallery._id && (
                <Button
                  outline
                  color="primary"
                  size="sm"
                  onClick={toggleEditGallery}
                >
                  Edit {label.titleGallery}
                </Button>
              )}
              {isCreator && !gallery.currentGallery._id && (
                <Button
                  outline
                  color="primary"
                  size="sm"
                  onClick={this.onCreateGallery}
                >
                  Submit final {label.project}
                </Button>
              )}
              {this.checkHaveTeamChat() &&
                (isCreator || this.checkIsTeamMember()) && (
                  <Button
                    outline
                    color="primary"
                    size="sm"
                    onClick={() => history.push("/message")}
                  >
                    TEAM CHAT
                  </Button>
                )}
              {this.checkFollowProject() && (
                <Button
                  outline
                  color="primary"
                  size="sm"
                  onClick={this.leaveProject}
                >
                  Leave {label.titleProject}
                </Button>
              )}
            </div>
          </div>
          {visible && (
            <Modal
              title={`${label.titleProject} Profile`}
              visible={visible}
              width={800}
              footer={false}
              onCancel={this.hideModal}
            >
              {curProj._id && modalContent === "edit" && (
                <EditProject id={curProj._id} hideModal={this.hideModal} />
              )}
              {curProj._id && modalContent === "share" && (
                <ShareProject id={curProj._id} hideModal={this.hideModal} />
              )}
            </Modal>
          )}
          {showContactModal && (
            <Modal
              title={`Open Chat room with project creator`}
              visible={showContactModal}
              onOk={this.handleOk}
              onCancel={this.toggleContactModal}
            >
              <Input.TextArea
                rows={2}
                onChange={this.onChangeChat}
                value={chatText}
                placeholder="Message"
              />
            </Modal>
          )}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    project: state.project,
    message: state.message,
    gallery: state.gallery,
    isAdmin: state.user.isAdmin,
    loginMode: state.auth.loginMode,
    fieldData: state.profile.fieldData,
    isJudge: state.user.isJudge,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getParticipant,
  joinProject,
  leaveProject,
  createTeamChat,
  setCurrentGallery,
  startConversation,
  fetchOneConversation,
})(ProjectInfo);
