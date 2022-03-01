import React from "react";
import { Form, Input, Button } from "antd";

const JoinMeetingForm = ({ onChange, fields, submitForm }) => (
  <Form
    name="global_state"
    layout="inline"
    fields={fields}
    onFieldsChange={(_, allFields) => {
      onChange(allFields);
    }}
    onFinish={submitForm}
  >
    <Form.Item
      name="roomName"
      label="Room Name"
      rules={[
        {
          required: true,
          message: "Room Name is required!",
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" type="primary">
        Join
      </Button>
    </Form.Item>
  </Form>
);

export default JoinMeetingForm;
