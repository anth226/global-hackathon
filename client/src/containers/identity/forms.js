import React, { useState } from "react";
import {
  Form,
  Input,
  message,
  Radio,
  Spin,
  Space,
  Modal,
  Select,
  Checkbox,
} from "antd";
import { Loading3QuartersOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import LocationProfile from "../../components/pages/location-profile";
import { countries } from "../../constants";

export const SignupForm = ({ onSubmit, invId, role }) => {
  const onFinish = (values) => {
    if (values.password.length < 8) {
      message.error("Password should be at least 8 characters in length");
      return;
    }
    if (values.password !== values.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    delete values.conf_password;
    values.invId = invId || null;
    onSubmit(values);
  };

  return (
    <Form name="register" className="register-form" onFinish={onFinish}>
      <div className="form-header">
        <h5>
          <b>{role}</b>
        </h5>
      </div>
      <div className="form-content">
        <Form.Item
          name="first_name"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input size="large" placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="last_name"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input size="large" placeholder="Last Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input size="large" type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input size="large" type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="conf_password"
          rules={[
            {
              required: true,
              message: "Please confirm your Password!",
            },
          ]}
        >
          <Input size="large" type="password" placeholder="Confirm Password" />
        </Form.Item>

        <button type="submit" className="blue-btn">
          Continue
        </button>
      </div>
    </Form>
  );
};

export const InviteForm = ({ onSubmit, onContinue, invId }) => {
  const [edited, setEdited] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    let emails = [];
    if (values.email1) emails.push(values.email1);
    if (values.email2) emails.push(values.email2);
    if (values.email3) emails.push(values.email3);
    setLoading(true);
    await onSubmit(emails);
    setLoading(false);
    onContinue();
  };

  const onGetStart = (e) => {
    e.preventDefault();
    onContinue();
  };

  const onValuesChange = (changedValues, allValues) => {
    setEdited(allValues.email1 || allValues.email2 || allValues.email3);
  };

  return (
    <Form
      name="integra-invite"
      className="invite-form"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <div className="form-header">
        <h5>
          <b>Invite friends and co-workers</b>
        </h5>
      </div>
      <div className="form-content">
        <Form.Item name="email1">
          <Input size="large" type="email" placeholder="Email #1" />
        </Form.Item>
        <Form.Item name="email2">
          <Input size="large" type="email" placeholder="Email #2" />
        </Form.Item>
        <Form.Item name="email3">
          <Input size="large" type="email" placeholder="Email #3" />
        </Form.Item>
        <div className="btn-group">
          <button type="submit" className="blue-btn" disabled={!edited}>
            {loading && (
              <Spin
                indicator={
                  <Loading3QuartersOutlined
                    style={{ fontSize: 18 }}
                    spin
                    className="mr-2"
                  />
                }
              />
            )}
            Invite
          </button>
          <button onClick={onGetStart} className="outline-btn">
            Skip
          </button>
        </div>
      </div>
    </Form>
  );
};

export const ChooseLocationForm = ({
  onSubmit,
  locations = [],
  onSetLocation,
}) => {
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState({});
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [nooption, setNooption] = useState(false);

  const onHideModal = () => {
    setVisible(false);
    setLocation({});
  };

  const onOpenModal = (location) => {
    setVisible(true);
    setLocation(location);
  };

  const showNoOption = (e) => {
    e.preventDefault();
    setNooption(true);
  };

  const onFinish = async (values) => {
    if (!nooption) {
      onSubmit(values.location);
      return;
    }
    if (!city) {
      message.error("City is required!");
      return;
    }
    onSetLocation({ country, city });
  };

  const handleCountryChange = (country) => {
    setCountry(country);
    setCity("");
    if (locations.filter((item) => item.venue_country === country).length > 0)
      setNooption(false);
  };

  const flocs = locations.filter((item) => item.venue_country === country);
  return (
    <Form name="locationform" className="location-form" onFinish={onFinish}>
      <div className="form-header">
        <h4>
          <b>2022 Global Legal Hackathon Hosting Location</b>
        </h4>
      </div>
      <div className="form-body">
        <div className="location-selectbox">
          <div className="country-box">
            <span className="form-label">Country</span>
            <Select size="large" showSearch onChange={handleCountryChange}>
              {countries.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          {nooption && (
            <div className="city-box">
              <p className="form-label">
                Please enter your city and we'll notify you when a host is
                registered.
              </p>
              <Input
                size="large"
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                value={city}
              />
            </div>
          )}
        </div>
        {country && !nooption && (
          <div className="location-select-box">
            {flocs.length === 0 && <p>No hosts in this location</p>}
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
          <button type="button" className="outline-btn" onClick={showNoOption}>
            Don't see your host?
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
          <LocationProfile locations={locations} location={location} />
        </Modal>
      )}
    </Form>
  );
};

export const CreateWalletForm = ({ onSubmit, invId }) => {
  const onFinish = async (values) => {
    if (!values.agree_policy) return;
    if (values.passphrase !== values.conf_passphrase) {
      message.error("Passphrases do not match!");
      return;
    }
    delete values.conf_passphrase;
    values.invId = invId || null;
    await onSubmit(values);
  };

  return (
    <Form name="integra-register" className="identity-form" onFinish={onFinish}>
      <Form.Item
        name="passphrase"
        rules={[
          {
            required: true,
            message: "Please input your Pass Phrase!",
          },
          { min: 10, message: "Passphrase must be minimum 10 characters." },
        ]}
      >
        <Input size="large" placeholder="Pass Phrase" />
      </Form.Item>
      <Form.Item
        name="conf_passphrase"
        rules={[
          {
            required: true,
            message: "Please confirm your Pass Phrase!",
          },
          { min: 10, message: "Passphrase must be minimum 10 characters." },
        ]}
      >
        <Input size="large" placeholder="Confirm Pass Phrase" />
      </Form.Item>
      <Form.Item name="agree_policy" valuePropName="checked">
        <Checkbox>
          <span className="checkbox-label w-form-label">
            I have read and accept the {" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </span>
        </Checkbox>
      </Form.Item>
      <button type="submit" className="integra-form-btn">
        Continue
      </button>
    </Form>
  );
};

export const EmailForm = ({ onSubmit, onContinue }) => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    await onSubmit(values.email);
    setLoading(false);
  };

  const onSkip = (e) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <Form name="integra-email" className="email-form" onFinish={onFinish}>
      <h5>Send your GLH private key file to your email</h5>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter your email!",
          },
        ]}
      >
        <Input size="large" type="email" placeholder="Enter Email" />
      </Form.Item>
      <div className="btn-group">
        <button type="submit" className="blue-btn">
          {loading && (
            <Spin
              indicator={
                <Loading3QuartersOutlined
                  style={{ fontSize: 18 }}
                  spin
                  className="mr-2"
                />
              }
            />
          )}
          Send
        </button>
        <button onClick={onSkip} className="outline-btn">
          Skip
        </button>
      </div>
    </Form>
  );
};

export const RegisterLocationForm = ({ onSubmit }) => {
  const onFinish = async (values) => {
    values.before_helped = values.before_helped || "Yes";
    values.have_condition = values.have_condition || "Yes";
    values.have_help = values.have_help || "Yes";
    values.hosted_2019 = values.hosted_2019 || "Yes";
    values.multi_city = values.multi_city || "Yes";
    values.support_food = values.support_food || "Yes";
    onSubmit(values);
  };

  const vRadioGroup = (
    <Radio.Group size="large" defaultValue="Yes">
      <Radio value={"Yes"}>Yes</Radio>
      <Radio value={"No"}>No</Radio>
      <Radio value={"Not Sure"}>Not Sure</Radio>
    </Radio.Group>
  );

  return (
    <Form name="locationform" className="location-form" onFinish={onFinish}>
      <div className="form-header">
        <h4>
          <b>2022 Global Legal Hackathon Hosting Form</b>
        </h4>
      </div>
      <div className="form-body">
        <h5>
          <b>2022 Global Legal Hackathon Hosting Statement of Interest​</b>
        </h5>
        <p>
          By filling out and submitting this profile you are confirming that
          your organization is interested in hosting the 2022 Global Legal
          Hackathon at a venue in your listed city of interest. This is a
          statement of interest only and does not confirm you or your
          organization as a host for the hackathon. If your organization is
          selected to host in your city, we will respond personally and let you
          know what the next steps are.{" "}
        </p>
        <p>
          We will make venue selections on a rolling basis.
          <br />
          Thank you!
        </p>
        <span className="form-label">Job title*</span>
        <Form.Item
          name="job_title"
          rules={[
            {
              required: true,
              message: "Please input the job title!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Organization interested in hosting*</span>
        <Form.Item
          name="organization"
          rules={[
            {
              required: true,
              message: "Please input organization!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Hosting venue name*</span>
        <Form.Item
          name="venue"
          rules={[
            {
              required: true,
              message: "Please input venue!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Proposed venue country</span>
        <Form.Item name="venue_country">
          <Select size="large" showSearch>
            {countries.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <span className="form-label">Venue city</span>
        <Form.Item name="venue_city">
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Venue street address</span>
        <Form.Item name="venue_street">
          <Input size="large" />
        </Form.Item>
        <span className="form-label">Venue postal or ZIP code</span>
        <Form.Item name="venue_zip">
          <Input size="large" />
        </Form.Item>
        <span className="form-label">
          Did your organization host the GLH 2019?
        </span>
        <Form.Item name="hosted_2019">{vRadioGroup}</Form.Item>
        <span className="form-label">
          Does the proposed venue have ample access to electrical outlets and
          high quality internet connections?
        </span>
        <Form.Item name="have_condition">{vRadioGroup}</Form.Item>
        <span className="form-label">
          How many participants can the proposed venue host?*
        </span>
        <Form.Item
          name="participants_number"
          rules={[
            {
              required: true,
              message: "Please input participants number!",
            },
          ]}
        >
          <Input size="large" type="number" />
        </Form.Item>
        <span className="form-label">
          Do you have help to organize, ie.. volunteers, team members, other
          committed parties?
        </span>
        <Form.Item name="have_help">{vRadioGroup}</Form.Item>
        <span className="form-label">
          Have you helped to organize a hackathon before?
        </span>
        <Form.Item name="before_helped">
          <Radio.Group size="large" defaultValue="Yes">
            <Radio value={"Yes"}>Yes</Radio>
            <Radio value={"No"}>No</Radio>
          </Radio.Group>
        </Form.Item>
        <span className="form-label">
          Will your proposed host organization be able to support food and
          beverage supplies for hackathon participants at your venue, or will
          you need additional sponsorship?
        </span>
        <Form.Item name="support_food">{vRadioGroup}</Form.Item>
        <span className="form-label">
          Does your organization want to host in Multiple Cities?(If marked yes,
          please create a profile for each location.)
        </span>
        <Form.Item name="multi_city">{vRadioGroup}</Form.Item>
        {/* <span className="form-label">Venue homepage content</span>
        <Form.Item name="content">
          <RichTextEditor />
        </Form.Item> */}
        <div className="btn-group">
          <button type="submit" className="blue-btn">
            Submit
          </button>
        </div>
      </div>
    </Form>
  );
};
