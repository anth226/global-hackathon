import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { Upload, UploadFile } from "../template";
import { Form, Input, Switch, Button } from "antd";
import RichTextEditor from "../pages/editor";
import { CloseOutlined, ClearOutlined } from "@ant-design/icons";
import GalleryTags from "../pages/tags_addons";

const CreateForm = ({
  toggleEditGallery,
  createGallery,
  updateGallery,
  gallery,
  setAvatar,
  avatarURL,
  setFile,
  fileURL,
  links,
  onAddLink,
  onRemoveLink,
  fieldData,
  label,
  challenge,
}) => {
  const [tags, setTags] = useState(gallery.tags || []);
  const processLink = (link) => {
    if (!link) return "";
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "http://" + link;
    }
    return link;
  };

  const onFinish = async (values) => {
    let newLinks = [];
    for (let link of links) {
      newLinks.push({
        key: link.key,
        title: values[`title-${link.key}`],
        link: processLink(values[`url-${link.key}`]),
      });
      delete values[`title-${link.key}`];
      delete values[`url-${link.key}`];
    }
    values.ready = values.ready || false;
    values.links = newLinks;
    values.file = fileURL;
    values.logo = avatarURL;
    values.project = gallery.project;
    values._id = gallery._id;
    values.tags = tags;
    values.challenge = challenge ? challenge._id : null;
    if (values._id) {
      updateGallery(values);
    } else {
      createGallery(values);
    }
    toggleEditGallery();
  };

  return (
    <Form
      name="create-gallery"
      onFinish={onFinish}
      initialValues={{ ...gallery }}
    >
      <div className="avatar-uploader mb-4">
        <Upload setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <Row>
        <Col md={12}>
          <label className="form-label">
            What is the final, public name for this {label.project} or
            application? (required)
          </label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the public name!",
              },
            ]}
          >
            <Input placeholder="Public Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Item name="file">
            <div className="flex">
              <UploadFile setUploadedFile={setFile} />
              {fileURL && (
                <Button
                  type="link"
                  className="ml-3"
                  onClick={() => setFile("")}
                >
                  <ClearOutlined />
                  Clean
                </Button>
              )}
            </div>
            {fileURL && (
              <a
                className="ml-2 mt-1"
                href={`${fileURL}#1`}
                target="_blank"
                rel="noopener noreferrer"
              >
                view file
              </a>
            )}
          </Form.Item>
        </Col>
      </Row>
      <div className="link-group">
        <p>Add links to web app, mobile apps, and additional documents</p>
        {links.map((item) => (
          <Row key={item.key}>
            <Col md={5} xs={12}>
              <Form.Item
                name={`title-${item.key}`}
                rules={[
                  {
                    required: true,
                    message: "Please input the link title!",
                  },
                ]}
              >
                <Input placeholder="Title" />
              </Form.Item>
            </Col>
            <Col md={6} xs={10}>
              <Form.Item
                name={`url-${item.key}`}
                rules={[
                  {
                    required: true,
                    message: "Please input the correct url!",
                  },
                ]}
              >
                <Input placeholder="URL" />
              </Form.Item>
            </Col>
            <Col md={1} xs={1}>
              <Button
                shape="circle"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => onRemoveLink(item.key)}
              />
            </Col>
          </Row>
        ))}
        <Button type="primary" onClick={onAddLink}>
          Add Link
        </Button>
      </div>
      <hr />
      <Row>
        <Col md={12}>
          <label className="form-label">Video Link</label>
          <Form.Item name="video">
            <Input placeholder="Video Link" />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label className="form-label">Short Description (required)</label>
          <Form.Item
            name="short_description"
            rules={[
              {
                required: true,
                message: `Please input the ${label.project} name!`,
              },
            ]}
          >
            <Input.TextArea
              className="short_description"
              placeholder="Short Description"
              maxLength="350"
              rows={2}
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label className="form-label">
            Detailed description of the {label.project} and application
            (required)
          </label>
          <Form.Item name="description">
            <RichTextEditor placeholder="Description" />
          </Form.Item>
        </Col>
      </Row>
      <GalleryTags
        fieldData={fieldData}
        tags={tags}
        updateTags={setTags}
        prefix={"gallery"}
      />
      <Row className="mt-4">
        <Col>
          <Form.Item
            name="ready"
            label={`Ready to judge`}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex">
        <button type="submit" className="btn-profile submit mr-2">
          Submit
        </button>
        <button className="btn-profile cancel" onClick={toggleEditGallery}>
          Cancel
        </button>
      </div>
    </Form>
  );
};

class EditGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarURL: this.props.gallery.logo,
      fileURL: this.props.gallery.file,
      links: this.props.gallery.links || [],
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  setFile = (url) => {
    this.setState({ fileURL: url });
  };

  onAddLink = () => {
    const { links } = this.state;
    links.push({ title: "", link: "", key: new Date().valueOf() });
    this.setState({ links });
  };

  onRemoveLink = (key) => {
    let links = this.state.links;
    for (let i = links.length - 1; i >= 0; i--) {
      if (links[i].key === key) {
        links.splice(i, 1);
        break;
      }
    }
    this.setState({ links });
  };

  render() {
    const { avatarURL, fileURL, links } = this.state;
    const {
      gallery,
      fieldData,
      toggleEditGallery,
      createGallery,
      updateGallery,
      label,
      challenge,
    } = this.props;
    gallery.links = gallery.links || [];
    gallery.links.map((link) => {
      gallery[`title-${link.key}`] = link.title;
      gallery[`url-${link.key}`] = link.link;
      return link;
    });
    return (
      <CreateForm
        toggleEditGallery={toggleEditGallery}
        createGallery={createGallery}
        updateGallery={updateGallery}
        gallery={gallery}
        setAvatar={this.setAvatar}
        avatarURL={avatarURL}
        setFile={this.setFile}
        fileURL={fileURL}
        links={links}
        onAddLink={this.onAddLink}
        onRemoveLink={this.onRemoveLink}
        fieldData={fieldData}
        label={label}
        challenge={challenge}
      />
    );
  }
}

export default EditGallery;
