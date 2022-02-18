import React from "react";
import { Form, Input, Switch } from "antd";

const EditAnnounceForm = ({
  createAnnounce,
  updateAnnounce,
  announce,
  hideModal,
}) => {
  const onFinish = (values) => {
    values.link = processLink(values.link)
    if (announce._id) {
      values._id = announce._id;
      updateAnnounce(values);
    } else {
      createAnnounce(values);
    }
    hideModal();
  };

  const processLink = (link) => {
    if (!link) return "";
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "http://" + link;
    }
    return link;
  }

  return (
    <Form
      name="create-challenge"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...announce }}
    >
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the announce name!",
          },
        ]}
      >
        <Input type="text" placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="description"
        rules={[
          {
            required: true,
            message: "Please input the description!",
          },
        ]}
      >
        <Input.TextArea placeholder="Description" rows={3} />
      </Form.Item>
      <Form.Item name="link">
        <Input type="text" placeholder="Link" />
      </Form.Item>
      <Form.Item name="active" label="Active" valuePropName="checked">
        <Switch />
      </Form.Item>
      <div className="flex">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
        <button className="btn-profile cancel" onClick={(e) => {
          e.preventDefault()
          hideModal()
        }}>
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default EditAnnounceForm;
