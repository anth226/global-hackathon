import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { message, Form, Input } from "antd";
import { orgInviteVerify } from "../../actions/organization";
import { LockOutlined } from "@ant-design/icons";

const PasswordForm = ({ onSubmit, token }) => {
  const onFinish = (values) => {
    if (values.password.length < 8) {
      message.error("Password should be at least 8 characters in length");
      return;
    }
    if (values.password !== values.conf_password) {
      message.error("Password confirmation doesn't match!");
      return;
    }
    onSubmit(token, values.password);
  };

  return (
    <Form name="org_register" className="mt-5" onFinish={onFinish}>
      <span className="form-label">Password</span>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          size="large"
          type="password"
        />
      </Form.Item>
      <span className="form-label">Confirm Password</span>
      <Form.Item
        name="conf_password"
        rules={[
          {
            required: true,
            message: "Please confirm your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          size="large"
          type="password"
        />
      </Form.Item>
      <div className="signup-btn">
        <button type="submit" className="hk_button">
          Submit
        </button>
      </div>
    </Form>
  );
};

class InviteVerify extends Component {
  onConfirm = async (token, password) => {
    await this.props.orgInviteVerify(token, password)
  };

  render = () => {
    const token = this.props.match.params.token;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="invite-box mt-5">
            <h3 className="summary-title text-center mb-4">
              <b>User Account Confirmation</b>
            </h3>
            <PasswordForm token={token} onSubmit={this.onConfirm} />
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { orgInviteVerify })(InviteVerify);
