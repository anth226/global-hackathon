import React from "react";
import { Row, Col } from "reactstrap";
import { Form, Input, Button } from "antd";
import RichTextEditor from "../pages/editor";

const ContactForm = ({ toggleModal, onSubmit }) => {
  const onFinish = async (values) => {
    console.log(values);
    onSubmit(values);
  };

  return (
    <Form name="contact-gallery" onFinish={onFinish}>
      <Row>
        <Col md={12}>
          <label className="form-label">Your email address (required)</label>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input the your email!",
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label className="form-label">Your phone number (optional)</label>
          <Form.Item name="phone">
            <Input placeholder="Phone" />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label className="form-label">Message (required)</label>
          <Form.Item
            name="message"
            rules={[
              {
                required: true,
                message: "Please input the your message!",
              },
            ]}
          >
            <RichTextEditor placeholder="Message" />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex">
        <Button type="primary" htmlType="submit" className="mr-2">
          Submit
        </Button>
        <Button type="default" onClick={toggleModal}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default ContactForm;
