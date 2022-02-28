import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Footer } from "../../components/template";
import { Card, Row } from "antd";
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
import history from "../../history";
import JoinMeetingForm from "./join-meeting-form";
import axios from "axios";
import cookie from "react-cookies";

const { Meta } = Card;

class CreateMeeting extends Component {
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
      fields: [
        {
          name: ["roomName"],
          value: "",
        },
      ],
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

  changeFields = (newFields) => {
    this.setState({ ...this.state, fields: newFields });
  };

  submitForm = async () => {
    const API_URL = process.env.REACT_APP_API_HOST;
    const { value } =
      this.state.fields.find((field) => field.name[0] === "roomName") || {};
    let response = await axios.post(
      `${API_URL}/meeting`,
      { title: value },
      {
        headers: { Authorization: cookie.load("token") },
      }
    );
    console.log(response.data);
    const { _id, title, startDate } = response.data;
    history.push(`/meeting/${_id}`);
  };

  render = () => {
    const { project, user, auth } = this.props;
    let isCreator =
      project.project.participant &&
      project.project.participant._id === user._id &&
      auth.loginMode === 0;

    return (
      <React.Fragment>
        <Header />
        <Row>
          <Row
            xl={4}
            md={5}
            className="mb-3 mx-auto"
            style={{ paddingTop: "300px", minHeight: "90vh" }}
          >
            <JoinMeetingForm
              fields={this.state.fields}
              onChange={(newFields) => {
                this.changeFields(newFields);
              }}
              submitForm={this.submitForm}
            />
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
    project: state.project,
    message: state.message,
    gallery: state.gallery,
    fieldData: state.profile.fieldData,
    loginMode: state.auth.loginMode,
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
})(CreateMeeting);
