import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Radio, Button, Input, message, Upload } from "antd";
import RichTextEditor from "../../../components/pages/editor";
import {
  sendAllNotification,
  sendProjectCreatorNotification,
  sendOrgNotification,
} from "../../../actions/notification";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: "participants",
      messageTxt: "",
      title: "",
      loading: false,
      selectedFiles: [],
      selectedFileList: [],
    };
  }

  onChangeMode = (e) => {
    this.setState({ mode: e.target.value });
  };

  onChangeMessage = (e) => {
    this.setState({ messageTxt: e });
  };

  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  onChange = async (info) => {
    const nextState = {};
    for (let f of info.fileList) {
      if (f.status === "uploading") {
        nextState.selectedFileList = info.fileList;
        this.setState(() => nextState);
        return;
      }
    }
    const selectedFiles = info.fileList.map((fl) => fl.originFileObj);
    nextState.selectedFileList = info.fileList;
    nextState.selectedFiles = selectedFiles;
    this.setState(() => nextState);
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  sendMessage = async () => {
    const { mode, messageTxt, title, selectedFiles } = this.state;
    const {
      sendAllNotification,
      sendProjectCreatorNotification,
      sendOrgNotification,
    } = this.props;

    if (!mode || !messageTxt || !title) {
      message.warn("All field are not filled correctly");
      return;
    }
    this.setState({ loading: true });
    const data = { title, content: messageTxt };
    switch (mode) {
      case "participants":
        await sendAllNotification(data, selectedFiles);
        this.setState({ loading: false });
        return;
      case "project_creators":
        await sendProjectCreatorNotification(data, selectedFiles);
        this.setState({ loading: false });
        return;
      case "hosts":
        await sendOrgNotification(data, selectedFiles);
        this.setState({ loading: false });
        return;
      default:
        this.setState({ loading: false });
        return;
    }
  };

  render() {
    const { mode, messageTxt, title, loading } = this.state;
    const { label } = this.props;

    return (
      <div className="content-admin">
        <Container>
          <Row>
            <Col className="flex">
              <h5 className="mr-auto">All {label.titleParticipant}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Radio.Group
                className="mt-4 mb-4"
                onChange={this.onChangeMode}
                value={mode}
              >
                <Radio value={"participants"} checked>
                  All {label.titleParticipant}
                </Radio>
                <Radio value={"project_creators"}>
                  {label.titleProject} Owners
                </Radio>
                <Radio value={"hosts"}>Hosts</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                className="mb-3"
                value={title}
                onChange={this.onChangeTitle}
                placeholder="Title"
              />
              <RichTextEditor
                placeholder="Message"
                onChange={this.onChangeMessage}
                value={messageTxt}
              />
              <Upload
                fileList={this.state.selectedFileList}
                customRequest={this.dummyRequest}
                onChange={this.onChange}
                multiple
              >
                <Button className="mt-3">Upload Document</Button>
              </Upload>
              <Button
                className="mt-5"
                onClick={this.sendMessage}
                type="primary"
                disabled={loading}
              >
                Send Message
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin, label: state.label };
}

export default connect(mapStateToProps, {
  sendAllNotification,
  sendProjectCreatorNotification,
  sendOrgNotification,
})(Message);
