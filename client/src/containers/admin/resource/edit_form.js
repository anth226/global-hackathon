import React, { useState } from "react";
import { Form, Input, Button, Radio, message } from "antd";
import ImageUpload from "../../../components/template/upload";
import PdfUpload from "../../../components/template/upload_file";

const EditResourceForm = ({
  resource,
  createResource,
  updateResource,
  hideModal,
}) => {
  const [resourceType, setResourceType] = useState(resource.type);
  const [link, setLink] = useState(resource.link);

  const onChangeResourceType = (e) => {
    setResourceType(e.target.value);
  };

  const processLink = (link) => {
    if (!link) return "";
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "http://" + link;
    }
    return link;
  };

  const onFinish = async (values) => {
    values.type = resourceType;
    values.link = processLink(link);
    if (!resourceType || !link) {
      message.warn("Resource data should be set correctly");
      return;
    }
    if (resource._id) {
      values._id = resource._id;
      await updateResource(values);
    } else {
      await createResource(values);
    }
    hideModal();
  };

  const hideEditForm = (e) => {
    e.preventDefault();
    hideModal();
  };

  return (
    <Form
      name="create-challenge"
      className="mt-2"
      onFinish={onFinish}
      initialValues={{ ...resource }}
    >
      <Radio.Group onChange={onChangeResourceType} value={resourceType} className="mb-4">
        <Radio value={"link"}>Link</Radio>
        <Radio value={"image"}>Image</Radio>
        <Radio value={"pdf"}>PDF</Radio>
      </Radio.Group>
      <Form.Item
        name="title"
        rules={[
          {
            required: true,
            message: "Please input the resource title!",
          },
        ]}
      >
        <Input type="text" placeholder="Title" />
      </Form.Item>
      <Form.Item name="short_description">
        <Input type="text" placeholder="Short Description" />
      </Form.Item>
      {resourceType === "link" && (
        <Input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      )}
      {resourceType === "image" && (
        <ImageUpload imageUrl={link} setAvatar={setLink} />
      )}
      {resourceType === "pdf" && (
        <div>
          <PdfUpload setUploadedFile={setLink} />
          {link && (
            <a
              className="ml-2 mt-1"
              href={`${processLink(link)}#1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              view file
            </a>
          )}
        </div>
      )}
      <div className="flex mt-4">
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

export default EditResourceForm;
