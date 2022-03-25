import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col } from "reactstrap";
import { Header, Footer } from "../../components/template";
import {
  Avatar,
  List,
  Card,
  Skeleton,
  Result,
  Input,
  Modal,
  message,
} from "antd";
import {
  getProject,
  getParticipant,
  inviteProjectTeam,
  acceptInviteTeam,
  cancelInviteProjectTeam,
  upvoteProject,
} from "../../actions/project";
import { listComment } from "../../actions/comment";
import { startConversation, fetchOneConversation } from "../../actions/message";
import {
  getProjectGallery,
  createGallery,
  updateGallery,
} from "../../actions/gallery";
import UserAvatar from "../../assets/img/user-avatar.png";
import ProjectInfo from "./project_info";
import Comments from "../../components/project/comment";
import GalleryForm from "../../components/gallery/create_form";
import PreviewGallery from "../gallery/preview_gallery";
import history from "../../history";

const { Meta } = Card;

class Project extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showEditor: false,
      curComment: {},
      visible: false,
      chatText: "",
      chosenParticipantId: "",
      editGallery: false,
      preview: false,
    };
  }

  componentDidMount = async () => {
    const {
      getProject,
      getParticipant,
      listComment,
      match,
      getProjectGallery,
    } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    await getProject(match.params.id);
    await getParticipant(match.params.id);
    await listComment(match.params.id);
    await getProjectGallery(match.params.id);
    if (!this._isMounted) return;
    this.setState({ loading: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  inviteParticipant = async (partId) => {
    const { project, inviteProjectTeam, getParticipant } = this.props;
    await inviteProjectTeam(project.project._id, partId);
    await getParticipant(project.project._id);
  };

  cancelInviteParticipant = async (partId) => {
    const { project, cancelInviteProjectTeam, getParticipant } = this.props;
    await cancelInviteProjectTeam(project.project._id, partId);
    await getParticipant(project.project._id);
  };

  acceptInviteTeam = async (pmId, accept) => {
    const { project, acceptInviteTeam, getParticipant } = this.props;
    await acceptInviteTeam(pmId, accept);
    await getParticipant(project.project._id);
  };

  haveChat = (participantId) => {
    let conversations = this.props.message.conversations;
    for (let cv of conversations) {
      if (cv.participants.length > 2) continue;
      let filters = cv.participants.filter((pt) => pt._id === participantId);
      if (filters.length > 0) return true;
    }
    return false;
  };

  upvoteProject = async (vote) => {
    const { upvoteProject, getProject, match } = this.props;
    await upvoteProject(match.params.id, vote);
    await getProject(match.params.id);
  };

  toggleModal = async (ptId) => {
    if (ptId && this.haveChat(ptId)) {
      await this.props.fetchOneConversation(ptId);
      history.push("/message");
      return;
    }
    this.setState({ visible: !this.state.visible, chosenParticipantId: ptId });
  };

  onChangeChat = (e) => {
    this.setState({ chatText: e.target.value });
  };

  handleOk = () => {
    const { chatText, chosenParticipantId } = this.state;
    if (!chatText || !chosenParticipantId) return;
    this.props.startConversation({
      recipient: chosenParticipantId,
      composedMessage: chatText,
    });
    this.toggleModal();
  };

  toggleEditGallery = () => {
    if (this.props.user.role === "Restrict") {
      message.warn(`You are not allowed to create ${this.props.label.gallery}`);
      return;
    }
    this.setState({ editGallery: !this.state.editGallery });
  };

  togglePreview = () => {
    this.setState({ preview: !this.state.preview });
  };

  render = () => {
    const { chatText, visible, loading, editGallery, preview } = this.state;
    const {
      project,
      user,
      gallery,
      createGallery,
      updateGallery,
      fieldData,
      label,
    } = this.props;
    let isCreator =
      project.project.participant &&
      project.project.participant._id === user._id;

    if (preview) return <PreviewGallery togglePreview={this.togglePreview} />;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {editGallery && (
            <GalleryForm
              toggleEditGallery={this.toggleEditGallery}
              gallery={gallery.currentGallery}
              createGallery={createGallery}
              updateGallery={updateGallery}
              challenge={project.project.challenge}
              fieldData={fieldData}
              label={label}
            />
          )}
          {!editGallery && (
            <div className="user-dashboard list-view">
              {!loading && (
                <ProjectInfo
                  toggleEditGallery={this.toggleEditGallery}
                  togglePreview={this.togglePreview}
                  curProj={project.project}
                  isCreator={isCreator}
                  projectId={this.props.match.params.id}
                  upvoteProject={this.upvoteProject}
                />
              )}
              {this.renderInvitation()}
              {!loading && <Comments projectId={this.props.match.params.id} />}
              {this.renderTeamMembers(isCreator)}
              {this.renderParticipants(isCreator)}
            </div>
          )}
          <Modal
            title={`Open Chat room with ${label.titleParticipant}`}
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

  renderInvitation = () => {
    const { participants, project } = this.props.project;
    const { loading } = this.state;
    if (loading) return this.renderLoading(loading);

    for (let item of participants) {
      if (item.participant._id === this.props.user._id && item.pending) {
        return (
          <Result
            className="mt-4"
            status="success"
            title="You are Invited"
            subTitle={`Congratulation! You are invited to our ${this.props.label.project} team - ${project.name}`}
            extra={[
              <Button
                color="primary"
                size="sm"
                key="accept"
                onClick={() => this.acceptInviteTeam(item._id, true)}
              >
                Accept
              </Button>,
              <Button
                outline
                color="danger"
                size="sm"
                key="buy"
                onClick={() => this.acceptInviteTeam(item._id, false)}
              >
                Decline
              </Button>,
            ]}
          />
        );
      }
    }
    return null;
  };

  renderTeamMembers = (isCreator) => {
    const { participants } = this.props.project;
    const listItem = participants.filter((item) => item.member === true);
    const { loading } = this.state;

    if (loading) return this.renderLoading(loading);
    return (
      <React.Fragment>
        <h5 className="mt-5">{this.props.label.titleProject} Team members</h5>
        <List
          itemLayout="horizontal"
          dataSource={listItem}
          renderItem={(item) => (
            <Card className="homepage-card name">
              <Meta
                title={
                  <Link
                    to={`/participant/${item.participant._id}`}
                  >{`${item.participant.profile.first_name} ${item.participant.profile.last_name}`}</Link>
                }
                avatar={
                  <Avatar src={item.participant.profile.photo || UserAvatar} />
                }
                description={
                  isCreator &&
                  `email: ${item.participant.email}${
                    item.participant.profile.phone
                      ? ", phone: " + item.participant.profile.phone
                      : ""
                  }`
                }
              />
              <div className="project-invite">
                {isCreator && (
                  <Button
                    outline
                    color="primary"
                    size="sm"
                    onClick={() => this.toggleModal(item.participant._id)}
                  >
                    Message
                  </Button>
                )}
              </div>
            </Card>
          )}
        />
      </React.Fragment>
    );
  };

  renderParticipants = (isCreator) => {
    const { participants } = this.props.project;
    const listItem = participants.filter((item) => item.member !== true);
    const { loading } = this.state;

    if (loading) return this.renderLoading(loading);
    return (
      <React.Fragment>
        <h5 className="mt-5">Add Teammate</h5>
        <List
          itemLayout="horizontal"
          dataSource={listItem}
          renderItem={(item) => (
            <Card className="homepage-card name">
              <Meta
                title={
                  <Link to={`/participant/${item.participant._id}`}>
                    {`${item.participant.profile.first_name} ${item.participant.profile.last_name}`}
                  </Link>
                }
                avatar={
                  <Avatar src={item.participant.profile.photo || UserAvatar} />
                }
                description={
                  isCreator &&
                  `email: ${item.participant.email}${
                    item.participant.profile.phone
                      ? ", phone: " + item.participant.profile.phone
                      : ""
                  }`
                }
              />
              <div className="project-invite">
                {isCreator && item.pending && (
                  <div className="flex">
                    <Button color="link" size="sm" disabled>
                      Waiting...
                    </Button>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() =>
                        this.cancelInviteParticipant(item.participant._id)
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                {this.props.isAdmin && item.pending && (
                  <div className="flex">
                    {!isCreator && (
                      <Button color="link" size="sm" disabled>
                        Waiting...
                      </Button>
                    )}
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => this.acceptInviteTeam(item._id, true)}
                    >
                      accept
                    </Button>
                  </div>
                )}
                {isCreator && !item.pending && (
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.inviteParticipant(item.participant._id)}
                  >
                    Add Team
                  </Button>
                )}
                {isCreator && (
                  <Button
                    outline
                    color="primary"
                    size="sm"
                    onClick={() => this.toggleModal(item.participant._id)}
                  >
                    Message
                  </Button>
                )}
              </div>
            </Card>
          )}
        />
      </React.Fragment>
    );
  };

  renderLoading = (loading) => (
    <Row>
      <Col>
        <Skeleton active loading={loading} />
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    auth: state.auth,
    project: state.project,
    message: state.message,
    gallery: state.gallery,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getProject,
  getParticipant,
  inviteProjectTeam,
  acceptInviteTeam,
  startConversation,
  cancelInviteProjectTeam,
  listComment,
  getProjectGallery,
  createGallery,
  updateGallery,
  fetchOneConversation,
  upvoteProject,
})(Project);
