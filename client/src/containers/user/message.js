import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Button, Input, message } from "antd";
import RichTextEditor from "../../components/pages/editor";
import { sendAllNotification } from "../../actions/location";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageTxt: "",
      title: "",
      loading: false,
    };
  }

  onChangeMessage = (e) => {
    this.setState({ messageTxt: e });
  };

  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  sendMessage = async () => {
    const { messageTxt, title } = this.state;
    const { sendAllNotification } = this.props;

    if (!messageTxt || !title) {
      message.warn("Please fill out both title and content forms");
      return;
    }
    this.setState({ loading: true });
    const data = { title, content: messageTxt };
    await sendAllNotification(data);
    this.setState({ loading: false, title: "", messageTxt: "" });
  };

  render() {
    const { messageTxt, title, loading } = this.state;
    return (
      <div className="content-host pt-4">
        <Row>
          <Col className="flex">
            <h5 className="mb-4">
              <b>Send Message to all participants</b>
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="form-label">Title*</span>
            <Input
              className="mb-4"
              value={title}
              onChange={this.onChangeTitle}
            />
            <span className="form-label">Content*</span>
            <RichTextEditor
              onChange={this.onChangeMessage}
              value={messageTxt}
            />
            <Button
              className="mt-4"
              onClick={this.sendMessage}
              type="primary"
              disabled={loading}
            >
              Send Message
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin };
}

export default connect(mapStateToProps, {
  sendAllNotification,
})(Message);
