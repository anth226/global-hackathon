import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getForgotPasswordToken } from "../../actions/auth";
import history from "../../history";
import { Header } from "../../components/template";
import HomeBoard from "../home/homeboard";

const ForgotForm = ({ sendMail }) => {
  const onFinish = (values) => {
    sendMail(values.email);
  };

  return (
    <Form name="forgot" className="general-form" onFinish={onFinish}>
      <div className="form-header">
        <h5>Forgot Password</h5>
      </div>
      <div className="form-body">
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            type="email"
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <button type="submit" className="glh-btn-blue-full mt-5">
          Reset Password
        </button>
        <div className="mt-3 center">
          <Button type="link" onClick={() => history.push("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    </Form>
  );
};

class ForgotPassword extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      history.push("/dashboard");
      return;
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <ForgotForm sendMail={this.props.getForgotPasswordToken} />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, {
  getForgotPasswordToken,
})(ForgotPassword);
