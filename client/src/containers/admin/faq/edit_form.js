import React from "react";
import { Form, Input, Button } from "antd";
import RichTextEditor from "../../../components/pages/editor";

const EditFaq = ({ curFaq, createFaq, updateFaq, hideFaqForm, curLength }) => {
  const onFinish = async (values) => {
    if (curFaq._id) {
      values._id = curFaq._id;
      if (curFaq.order === 1000 && values.answer) values.order = curLength;
      await updateFaq(values);
    } else {
      if (values.answer) values.order = curLength;
      await createFaq(values);
    }
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
      <Form.Item name="answer">
        <RichTextEditor placeholder="Answer" />
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
