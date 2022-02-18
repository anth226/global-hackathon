import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import { Col, Row } from "reactstrap";
import Avatar from "../../components/template/upload";
import { countries } from "../../constants";
import RichTextEditor from "../../components/pages/editor";
import { connect } from "react-redux";
import { Header, Footer } from "../../components/template";
import { updateProfile } from "../../actions/auth";
import history from "../../history";

const ProfileForm = ({ onSubmit, profile, setAvatar, avatarURL }) => {
  const processLink = (link) => {
    if (!link) return "";
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "http://" + link;
    }
    return link;
  };

  const onFinish = (values) => {
    values.photo = avatarURL;
    values.facebook = processLink(values.facebook);
    values.linkedin = processLink(values.linkedin);
    values.twitter = processLink(values.twitter);
    values.web = processLink(values.web);
    onSubmit(values);
  };

  return (
    <Form
      name="org_register"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...profile }}
    >
      <div className="avatar-uploader">
        <Avatar setAvatar={setAvatar} imageUrl={avatarURL} />
      </div>
      <Row className="mt-5">
        <Col md={6} sm={12}>
          <span className="form-label">First Name*</span>
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
          <span className="form-label">Last Name*</span>
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
          <span className="form-label">Email*</span>
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
          <span className="form-label">Organization*</span>
          <Form.Item
            name="org_name"
            rules={[
              {
                required: true,
                message: "Please input your organization name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
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
          <span className="form-label">Title*</span>
          <Form.Item
            name="role"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <span className="form-label">Phone</span>
          <Form.Item name="phone">
            <Input size="large" />
          </Form.Item>
          <span className="form-label">Address</span>
          <Form.Item name="address">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="form-label">Bio*</span>
          <Form.Item name="personal_statement">
            <RichTextEditor placeholder="Personal Statement" />
          </Form.Item>
        </Col>
      </Row>
      <hr className="mt-4 mb-4" />
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
      <Row>
        <Col>
          <span className="form-label">Best way to contact me</span>
          <Form.Item name="contact">
            <Input.TextArea rows={2} size="large" />
          </Form.Item>
        </Col>
      </Row>
      <div className="profile-btn mb-4">
        <button type="submit" className="hk_button">
          Save
        </button>
      </div>
    </Form>
  );
};

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = { avatarURL: "" };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onUpdateProfile = async (profile) => {
    await this.props.updateProfile({ profile });
    history.push("/judge-dashboard");
  };

  render = () => {
    const { user } = this.props;
    let profile = user.profile || {};
    profile.email = user.email;

    return (
      <React.Fragment>
        <Header />
        <div className="container ">
          <h1 className="mt-5 mb-4 center">Judge Profile</h1>
          <ProfileForm
            onSubmit={this.onUpdateProfile}
            profile={profile}
            setAvatar={this.setAvatar}
            avatarURL={this.state.avatarURL || profile.photo}
          />
        </div>
        <Footer />
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, { updateProfile })(ProfilePage);
