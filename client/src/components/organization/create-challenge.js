import React, { useState } from "react";
import { Form, Input, Drawer } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import RichTextEditor from "../pages/editor";
import Tags from "../pages/tags_addons";
import ChallengeIntro from "./challenge_intro";
import { getOneFieldData } from "../../utils/helper";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { BigUpload } from "../template";

const CreateForm = ({
  createChallenge,
  hideChallengePage,
  updateChallenge,
  setAvatar,
  avatarURL,
  curChallenge,
  fieldData,
  label,
  onshowDrawer,
}) => {
  const [tags, setTags] = useState(curChallenge.tags || []);

  const onFinish = (values) => {
    values.logo = avatarURL;
    values.public = true;
    values.participant = curChallenge.participant || null;
    values.tags = tags;
    values.supports = curChallenge.supports || [];
    values.likes = curChallenge.likes || [];

    if (curChallenge._id) {
      values._id = curChallenge._id;
      updateChallenge(values);
    } else {
      createChallenge(values);
    }
    if (hideChallengePage) hideChallengePage();
  };

  return (
    <Form
      name="create-challenge"
      className="mt-3"
      onFinish={onFinish}
      initialValues={{ ...curChallenge }}
    >
      <Row>
        <Col md={6} sm={12}>
          <div className="mb-4">
            <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
          </div>
        </Col>
        <Col md={6} sm={12}>
          <span className="form-label">{label.titleChallenge} Title *</span>
          <Form.Item
            name="challenge_name"
            rules={[
              {
                required: true,
                message: `Please input the ${label.challenge} title!`,
              },
            ]}
          >
            <Input type="text" className="name" placeholder={"Title"} />
          </Form.Item>

          <span className="form-label">
            Geography * - Specify the city, country, or region; multiple
            geographies, or global
          </span>
          <Form.Item
            name="geography"
            rules={[
              {
                required: true,
                message: "Please input the geography!",
              },
            ]}
          >
            <Input
              type="text"
              className="geography"
              placeholder={"Geography"}
            />
          </Form.Item>

          <span className="form-label">
            Beneficiaries * - Who do you expect will benefit from addressing
            your {label.challenge}?
          </span>
          <Form.Item
            name="benefit"
            rules={[
              {
                required: true,
                message: "Please input the benefit!",
              },
            ]}
          >
            <Input type="text" className="benifit" placeholder={"Benefit"} />
          </Form.Item>
        </Col>
      </Row>

      <span className="form-label">
        Short Description (350 characters max) *
      </span>
      <Form.Item
        name="short_description"
        rules={[
          {
            required: true,
            message: "Please input the short description!",
          },
        ]}
      >
        <Input.TextArea
          className="shot-description"
          placeholder="Short Description"
          maxLength="350"
          rows={2}
        />
      </Form.Item>

      <span className="form-label">
        Keywords * - Enter keywords related to your {label.challenge} to make it
        easier for others to find it
      </span>
      <Form.Item
        name="keywords"
        rules={[
          {
            required: true,
            message: "Please input the keywords!",
          },
        ]}
      >
        <Input type="text" className="benifit" placeholder={"Keywords"} />
      </Form.Item>

      <span className="form-label">
        Description (4000 characters max) * - Describe your Challenge in detail.
        <br />
        <b>These guiding questions may help:</b>
        <br />
        What is the specific problem that you aim to solve? What is the current
        context/situation? Who or what is it adversely affecting, and how? What
        is the scale or impact of the problem? What constraints must be
        considered when aiming to solve this issue? What outcome(s) will be
        achieved if your Challenge is adequately addressed?
      </span>
      <Form.Item
        name="description"
        rules={[
          {
            required: true,
            message: "Please input the description!",
          },
        ]}
      >
        <RichTextEditor placeholder="Description" limit={4000} />
      </Form.Item>

      <Tags
        fieldData={fieldData}
        tags={tags}
        updateTags={setTags}
        prefix={"challenge"}
      />

      <Link to="#" onClick={onshowDrawer}>
        See Rules <QuestionCircleOutlined />
      </Link>
      <br />
      <br />

      <div className="flex btn-form-group">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
        <button
          className="btn-profile cancel"
          onClick={(e) => {
            e.preventDefault();
            hideChallengePage();
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

class CreateChallenge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarURL: "",
      showIntro: props.curChallenge._id ? false : true,
      showDrawer: false,
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  hideIntro = () => {
    this.setState({ showIntro: false });
  };

  onShowDrawer = () => {
    this.setState({ showDrawer: true });
  };

  onCloseDrawer = () => {
    this.setState({ showDrawer: false });
  };

  render = () => {
    const { curChallenge, fieldData } = this.props;
    const { avatarURL, showIntro, showDrawer } = this.state;
    const rule = getOneFieldData(fieldData, "chl_rule");
    return (
      <div className="login-page">
        {!showIntro && (
          <h4 className="mt-3 mb-4">
            {curChallenge._id ? "Update" : "Create"}{" "}
            {this.props.label.challenge}
          </h4>
        )}
        {!showIntro && (
          <CreateForm
            {...this.props}
            setAvatar={this.setAvatar}
            avatarURL={avatarURL || curChallenge.logo}
            onshowDrawer={this.onShowDrawer}
          />
        )}
        {showIntro && <ChallengeIntro hideIntro={this.hideIntro} rule={rule} />}
        <Drawer
          title="Challenge Submission Form"
          placement="right"
          onClose={this.onCloseDrawer}
          visible={showDrawer}
          width={700}
        >
          <div
            className="sun-editor-editable mb-3"
            dangerouslySetInnerHTML={{ __html: rule }}
          />
        </Drawer>
      </div>
    );
  };
}

export default CreateChallenge;
