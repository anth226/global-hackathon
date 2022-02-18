import React, { useState } from "react";
import { BigUpload } from "../template";
import { Form, Input, Switch, Select, Row, Col } from "antd";
import RichTextEditor from "../pages/editor";
import { countries } from "../../constants/countries";
import ProjectTags from "../pages/tags_addons";

const CreateForm = ({
  onSubmit,
  curProject,
  hideProjectCreate,
  label,
  fieldData,
}) => {
  const [avatarURL, setAvatar] = useState(curProject.logo);
  const [tags, setTags] = useState(curProject.tags || []);

  const onFinish = async (values) => {
    values.participant = curProject.participant;
    values.logo = avatarURL;
    values.tags = tags;
    values.sharers = curProject.sharers || [];
    values.likes = curProject.likes || [];
    values._id = curProject._id || null;
    await onSubmit(values);
  };

  return (
    <Form
      name="create-challenge"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...curProject }}
    >
      <Row gutter={20}>
        <Col md={12} sm={24} xs={24}>
          <div className="center mb-4">
            <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
          </div>
        </Col>
        <Col md={12} sm={24} xs={24}>
          <span className="form-label">{label.titleProject} name*</span>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: `Please input the ${label.project} name!`,
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          {/* <span className="form-label">Challenge*</span>
          <Form.Item
            name="challenge"
            rules={[
              {
                required: true,
                message: `Please select the challenge of project!`,
              },
            ]}
          >
            <Select size="large">
              {challenges.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.challenge_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <span className="form-label">Short Description*</span>
          <Form.Item
            name="short_description"
            rules={[
              {
                required: true,
                message: `Please input the ${label.project} short description!`,
              },
            ]}
          >
            <Input.TextArea
              className="short_description"
              maxLength="350"
              rows={3}
            />
          </Form.Item>
        </Col>
      </Row>
      <span className="form-label">Description: </span>
      <span style={{ fontSize: "13px" }}>
        Briefly outline the challenge you are solving and the proposed solution.
      </span>
      <Form.Item name="description">
        <RichTextEditor />
      </Form.Item>
      <span className="form-label">
        From which country is your project lead
      </span>
      <Form.Item name="country">
        <Select size="large">
          {countries.map((item) => (
            <Select.Option key={item.name} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <span className="form-label">Collaborators: </span>
      <span style={{ fontSize: "13px" }}>
        Please list organisations currently involved and any skills or new
        collaborators you are looking for.
      </span>
      <Form.Item name="collaborators">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="public" label={"Public"} valuePropName="checked">
        <Switch />
      </Form.Item>
      <ProjectTags
        fieldData={fieldData}
        tags={tags}
        updateTags={setTags}
        prefix={"project"}
      />
      <div className="flex btn-form-group">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
        <button
          className="btn-profile cancel"
          onClick={(e) => {
            e.preventDefault();
            hideProjectCreate();
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default CreateForm;
