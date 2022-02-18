import React from "react";
import { Form, Input, Button, Switch, Radio, Popconfirm } from "antd";
import RichTextEditor from "../../../components/pages/editor";
import {
  useQuote,
  formulateQuote,
  knowledgeQuote,
  toolsQuote,
  videoQuote,
} from "../../help";

const EditHelpDoc = ({
  helpdoc,
  createHelpDoc,
  updateHelpDoc,
  deleteHelpDoc,
  hideModal,
  setLoading,
  label,
}) => {
  const onFinish = async (values) => {
    setLoading(true);
    if (helpdoc._id) {
      values._id = helpdoc._id;
      await updateHelpDoc(values);
    } else {
      await createHelpDoc(values);
    }
    hideModal();
    setLoading(false);
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideModal();
  };

  const deleteDoc = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deleteHelpDoc(helpdoc._id);
    hideModal();
    setLoading(false);
  };

  return (
    <Form
      name="create-challenge"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...helpdoc }}
    >
      <Form.Item
        name="title"
        rules={[
          {
            required: true,
            message: "Please input the help document title!",
          },
        ]}
      >
        <Input type="text" placeholder="Title" />
      </Form.Item>
      <Form.Item name="content">
        <RichTextEditor placeholder="Content" />
      </Form.Item>
      <Form.Item name="popular" label="Popular" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="related" label="Related">
        <Radio.Group>
          <Radio value={useQuote}>{useQuote}</Radio>
          <Radio value={formulateQuote}>{formulateQuote}</Radio>
          <Radio value={knowledgeQuote}>{knowledgeQuote}</Radio>
          <Radio value={toolsQuote}>{toolsQuote}</Radio>
          <Radio value={videoQuote}>{videoQuote}</Radio>
        </Radio.Group>
      </Form.Item>
      <div className="flex">
        <Button type="primary" htmlType="submit" className="mr-2">
          Save
        </Button>
        <Button className="mr-2" onClick={hideEditForm}>
          Cancel
        </Button>
        {helpdoc._id && (
          <Popconfirm
            title="Are you sure delete this document?"
            onConfirm={deleteDoc}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        )}
      </div>
    </Form>
  );
};

export default EditHelpDoc;
