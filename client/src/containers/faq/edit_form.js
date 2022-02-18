import React from "react";
import { Form, Input, Button } from "antd";

const EditFaq = ({ curFaq, createFaq, hideFaqForm }) => {
  const onFinish = async (values) => {
    await createFaq(values);
    hideFaqForm();
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideFaqForm();
  };

  return (
    <Form
      name="create-challenge"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...curFaq }}
    >
      <Form.Item
        name="question"
        rules={[
          {
            required: true,
            message: "Please input your question!",
          },
        ]}
      >
        <Input type="text" placeholder="Question" />
      </Form.Item>
      <div className="flex">
        <Button type="primary" htmlType="submit" className="mr-2">
          Save
        </Button>
        <Button className="mr-2" onClick={hideEditForm}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditFaq;
