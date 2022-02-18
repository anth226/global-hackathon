import React from "react";
import { Form, Input, Button } from "antd";
import { Col, Row } from "reactstrap";

const LabelForm = ({ updateLabel, label }) => {
  const onFinish = (values) => {
    values._id = label._id;
    updateLabel(values);
  };

  return (
    <Form
      name="create-challenge"
      onFinish={onFinish}
      initialValues={{ ...label }}
    >
      <Row>
        <Col md={6}>
          <span>Participant</span>
          <Form.Item
            name="participant"
            rules={[
              {
                required: true,
                message: "Please input the participant label!",
              },
            ]}
          >
            <Input type="text" placeholder="Participant" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span>Organization</span>
          <Form.Item
            name="organization"
            rules={[
              {
                required: true,
                message: "Please input the organization label!",
              },
            ]}
          >
            <Input type="text" placeholder="Organization" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span>Challenge</span>
          <Form.Item
            name="challenge"
            rules={[
              {
                required: true,
                message: "Please input the challenge label!",
              },
            ]}
          >
            <Input type="text" placeholder="Challenge" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span>Project</span>
          <Form.Item
            name="project"
            rules={[
              {
                required: true,
                message: "Please input the project label!",
              },
            ]}
          >
            <Input type="text" placeholder="Project" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span>Gallery</span>
          <Form.Item
            name="gallery"
            rules={[
              {
                required: true,
                message: "Please input the gallery label!",
              },
            ]}
          >
            <Input type="text" placeholder="Gallery" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span>Review</span>
          <Form.Item
            name="review"
            rules={[
              {
                required: true,
                message: "Please input the review label!",
              },
            ]}
          >
            <Input type="text" placeholder="Review" />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit" className="btn-admin-save">
        Save Label
      </Button>
    </Form>
  );
};

export default LabelForm;
