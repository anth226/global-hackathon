import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Button, Switch } from "antd";
import { setSummary, updateFieldData } from "../../../actions/profile";
import RichTextEditor from "../../../components/pages/editor";
import { updateLabel } from "../../../actions/label";
import LabelForm from "./label";
import { getOneFieldData } from "../../../utils/helper";

class SiteSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: getOneFieldData(this.props.fields.fieldData, "summary"),
      privacy: getOneFieldData(this.props.fields.fieldData, "privacy"),
      rules: getOneFieldData(this.props.fields.fieldData, "rules"),
    };
  }

  onChangeSummary = (value) => {
    this.setState({ summary: value });
  };

  onChangePrivacy = (value) => {
    this.setState({ privacy: value });
  };

  onChangeRules = (value) => {
    this.setState({ rules: value });
  };

  onChangeShowGallery = (checked) => {
    this.props.updateFieldData({
      field: "show_gallery",
      value: checked ? "true" : "",
    });
  };

  onChangeShowJudge = (checked) => {
    this.props.updateFieldData({
      field: "show_judge",
      value: checked ? "true" : "",
    });
  };

  onChangeShowChallenge = (checked) => {
    this.props.updateFieldData({
      field: "show_challenge",
      value: checked ? "true" : "",
    });
  };

  onChangeChatEncrypt = (checked) => {
    this.props.updateFieldData({
      field: "chat_encrypt",
      value: checked ? "true" : "",
    });
  };

  onSaveSummary = () => {
    const { summary } = this.state;
    if (!summary) return;
    this.props.setSummary(summary);
  };

  onSavePrivacy = () => {
    const { privacy } = this.state;
    if (!privacy) return;
    this.props.updateFieldData({
      field: "privacy",
      value: privacy,
    });
  };

  onSaveRules = () => {
    const { rules } = this.state;
    if (!rules) return;
    this.props.updateFieldData({
      field: "rules",
      value: rules,
    });
  };

  render() {
    return (
      <div className="container">
        <Row className="mb-5">
          <Col className="flex">
            <h5 className="mr-auto">Site Setting</h5>
          </Col>
        </Row>
        <div className="admin-settings-block pb-5">
          <span className="mr-2">Show Gallery</span>
          <Switch
            defaultChecked={
              !!getOneFieldData(this.props.fields.fieldData, "show_gallery")
            }
            onChange={this.onChangeShowGallery}
          />
          <span className="ml-5 mr-2">Show Judges</span>
          <Switch
            defaultChecked={
              !!getOneFieldData(this.props.fields.fieldData, "show_judge")
            }
            onChange={this.onChangeShowJudge}
          />
          <span className="ml-5 mr-2">Show Challenge</span>
          <Switch
            defaultChecked={
              !!getOneFieldData(this.props.fields.fieldData, "show_challenge")
            }
            onChange={this.onChangeShowChallenge}
          />
          <span className="ml-5 mr-2">Encrypt Chat</span>
          <Switch
            defaultChecked={
              !!getOneFieldData(this.props.fields.fieldData, "chat_encrypt")
            }
            onChange={this.onChangeChatEncrypt}
          />
        </div>
        <span>Summary Edit</span>
        <div className="admin-settings-block">
          <RichTextEditor
            placeholder="Summary"
            onChange={this.onChangeSummary}
            value={this.state.summary}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            className="btn-admin-save"
            onClick={this.onSaveSummary}
          >
            Save Summary
          </Button>
        </div>
        <span>Privacy Policy Edit</span>
        <div className="admin-settings-block">
          <RichTextEditor
            placeholder="Privacy Policy"
            onChange={this.onChangePrivacy}
            value={this.state.privacy}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            className="btn-admin-save"
            onClick={this.onSavePrivacy}
          >
            Save Privacy
          </Button>
        </div>
        <span>Rules</span>
        <div className="admin-settings-block">
          <RichTextEditor
            placeholder="Platform Rules"
            onChange={this.onChangeRules}
            value={this.state.rules}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            className="btn-admin-save"
            onClick={this.onSaveRules}
          >
            Save Rules
          </Button>
        </div>
        <span>Edit Labels</span>
        <div className="admin-settings-block">
          <LabelForm
            updateLabel={this.props.updateLabel}
            label={this.props.label}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fields: state.profile, label: state.label };
}

export default connect(mapStateToProps, {
  setSummary,
  updateLabel,
  updateFieldData,
})(SiteSetting);
