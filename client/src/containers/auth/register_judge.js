import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, message } from "antd";
import { judgeRegister } from "../../actions/judge";
import { Header, Footer } from "../../components/template";
import { Col, Row } from "reactstrap";
import RichTextEditor from "../../components/pages/editor";

const SignupForm = ({ onSubmit }) => {
  const onFinish = (values) => {
    if (values.password !== values.conf_password) {
      message.error("password confirmation doesn't match!");
      return;
    }
    delete values.conf_password;
    onSubmit(values);
  };

  return (
    <Form name="register" className="register-form" onFinish={onFinish}>
      <Row>
        <Col md={6}>
          <span className="form-label">First Name*</span>
          <Form.Item
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span className="form-label">Last Name*</span>
          <Form.Item
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <span className="form-label">Email*</span>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input size="large" type="email" />
          </Form.Item>
        </Col>
        <Col md={6}>
          <span className="form-label">Title*</span>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
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
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="form-label">Bio*</span>
          <Form.Item name="personal_statement">
            <RichTextEditor />
          </Form.Item>
        </Col>
      </Row>
      <hr className="mt-4 mb-5" />
      <span className="form-label">Password*</span>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input size="large" type="password" />
      </Form.Item>
      <span className="form-label">Confirm Password*</span>
      <Form.Item
        name="conf_password"
        rules={[
          {
            required: true,
            message: "Please confirm your Password!",
          },
        ]}
      >
        <Input size="large" type="password" />
      </Form.Item>
      <div className="signup-btn mt-5">
        <button type="submit" className="hk_button">
          Register
        </button>
      </div>
    </Form>
  );
};

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {},
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="login-page">
          <h2 className="mt-5 mb-4">Register as a Judge</h2>
          <SignupForm onSubmit={this.props.judgeRegister} />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { judgeRegister })(Register);
