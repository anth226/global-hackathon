import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Modal, Radio, Space } from "antd";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { BigUpload } from "../../components/template";
import { countries } from "../../constants";
import { processLink, getFieldData } from "../../utils/helper";
import OrgProfileForm from "../organization/profile";
import LocationProfile from "../../components/pages/location-profile";

const ProfileForm = ({
  onSubmit,
  profile,
  setAvatar,
  avatarURL,
  fieldData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const positions = getFieldData(fieldData, "user_role");

  const onFinish = (values) => {
    values.photo = avatarURL;
    values.org_role = profile.org_role;
    values.location = profile.location;
    values.city = profile.city;
    values.host_verified = profile.host_verified;
    values.location_role = profile.location_role;
    values.facebook = processLink(values.facebook);
    values.linkedin = processLink(values.linkedin);
    values.twitter = processLink(values.twitter);
    values.web = processLink(values.web);
    onSubmit(values);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <Form
      name="org_register"
      onFinish={onFinish}
      initialValues={{ ...profile }}
    >
      <Row>
        <Col md={4} className="mb-4">
          <h4 className="mb-4">
            <b>
              {profile.first_name} {profile.last_name}
            </b>
          </h4>
          <p>logo or profile picture</p>
          <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
        </Col>
        <Col md={8}>
          <div className="account-form-box">
            <Row>
              <Col md={6} sm={12}>
                <span className="form-label">First name*</span>
                <Form.Item
                  name="first_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the first name!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col md={6} sm={12}>
                <span className="form-label">Last name*</span>
                <Form.Item
                  name="last_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the last name!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={12}>
                <span className="form-label">Email</span>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input the email!",
                    },
                  ]}
                >
                  <Input type="email" size="large" />
                </Form.Item>
              </Col>
              <Col md={6} sm={12}>
                <span className="form-label">Phone</span>
                <Form.Item name="phone">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={12}>
                <span className="form-label">Country</span>
                <Form.Item name="country">
                  <Select size="large" showSearch>
                    {countries.map((item) => (
                      <Select.Option key={item.name} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={6} sm={12}>
                <span className="form-label">Position</span>
                <Form.Item name="position">
                  <Select size="large">
                    {positions.map((item) => (
                      <Select.Option key={item._id} value={item.value}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <span className="form-label">Address</span>
            <Form.Item name="address">
              <Input size="large" />
            </Form.Item>
            <span className="form-label">
              What is ther best way to contact you?
            </span>
            <Form.Item name="contact">
              <Input size="large" />
            </Form.Item>
            <span className="form-label">Personal statement</span>
            <Form.Item name="personal_statement">
              <Input.TextArea rows={3} size="large" />
            </Form.Item>
          </div>

          <div className="account-form-box mt-4">
            <h5 className="mb-4">
              <b>Social information</b>
            </h5>
            <Row>
              <Col md={6} sm={12}>
                <span className="form-label">Twitter</span>
                <Form.Item name="twitter">
                  <Input size="large" />
                </Form.Item>
                <span className="form-label">LinkedIn</span>
                <Form.Item name="linkedin">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col md={6} sm={12}>
                <span className="form-label">Facebook</span>
                <Form.Item name="facebook">
                  <Input size="large" />
                </Form.Item>
                <span className="form-label">Website</span>
                <Form.Item name="web">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Button
            type="ghost"
            htmlType="submit"
            className="black-btn mt-4"
            style={{ float: "right" }}
          >
            Save
          </Button>
        </Col>
      </Row>
      <Modal
        title="Create Organization"
        visible={showModal}
        width={800}
        footer={false}
        onCancel={hideModal}
      >
        <OrgProfileForm onNext={hideModal} org={{}} />
      </Modal>
    </Form>
  );
};

export const ChooseHostForm = ({ onSubmit, locations = [], onClose }) => {
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState({});
  const [country, setCountry] = useState("");

  const onHideModal = () => {
    setVisible(false);
    setLocation({});
  };

  const onOpenModal = (location) => {
    setVisible(true);
    setLocation(location);
  };

  const onCloseForm = (e) => {
    e.preventDefault();
    onClose();
  };

  const onFinish = async (values) => {
    await onSubmit(values.location);
    onClose();
  };

  const flocs = locations.filter((item) => item.venue_country === country);
  return (
    <Form name="locationform" className="location-form" onFinish={onFinish}>
      <div className="form-header">
        <h5>2022 Global Legal Hackathon Hosting Location</h5>
      </div>
      <div className="form-body">
        <div className="location-selectbox">
          <div className="country-box">
            <span className="form-label">Country</span>
            <Select size="large" showSearch onChange={setCountry}>
              {countries.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        {country && (
          <div className="location-select-box">
            <Form.Item
              name="location"
              rules={[
                {
                  required: true,
                  message: "Please select location!",
                },
              ]}
            >
              <Radio.Group size="large" style={{ width: "100%" }}>
                <Space direction="vertical" className="location-item">
                  {flocs.map((loc) => (
                    <Radio key={loc._id} value={loc._id}>
                      <p>
                        <b>{loc.venue}</b>
                        <Link
                          to="#"
                          onClick={() => onOpenModal(loc)}
                          className="pl-3"
                        >
                          <EyeOutlined />
                        </Link>
                      </p>
                      <span>
                        {loc.organization} ({loc.venue_street}, {loc.venue_city}
                        , {loc.venue_zip}, {loc.venue_country})
                      </span>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
          </div>
        )}

        <div className="btn-group">
          <button type="submit" className="blue-btn">
            Submit
          </button>
          <button type="button" className="outline-btn" onClick={onCloseForm}>
            Cancel
          </button>
        </div>
      </div>
      {visible && (
        <Modal
          title={"Location Profile"}
          visible={visible}
          width={900}
          footer={false}
          onCancel={onHideModal}
        >
          <LocationProfile location={location} />
        </Modal>
      )}
    </Form>
  );
};

export default ProfileForm;
