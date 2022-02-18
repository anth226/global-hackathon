import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { loginUser, resendVerification } from "../../actions/auth";
import history from "../../history";
import { Header } from "../../components/template";
import HomeBoard from "../home/homeboard";

const LoginForm = ({ onSubmit }) => {
  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="login"
      className="general-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <div className="form-header">
        <h5>Log In</h5>
      </div>
      <div className="form-body">
        <span className="form-label">Email</span>
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
            placeholder="Password"
          />
        </Form.Item>
        <div className="login-forgot">
          <Form.Item>
            <Form.Item name="remember" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Link to="/forgot-password/user">Forgot password</Link>
        </div>
        <button type="submit" className="glh-btn-blue-full">
          Log in
        </button>
        <div className="mt-3 center">
          <Button type="link" onClick={() => history.push("/identity")}>
            Login with Integra Smart Identity
          </Button>
        </div>
      </div>
    </Form>
  );
};

class Login extends Component {
  componentDidMount() {
    if (this.props.authenticated && this.props.loginMode === 0) {
      history.push("/dashboard");
      return;
    }
  }

  render() {
    const { loginUser, resendVerification } = this.props;
    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <LoginForm onSubmit={loginUser} resend={resendVerification} />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated,
    loginMode: state.auth.loginMode,
  };
}

export default connect(mapStateToProps, { loginUser, resendVerification })(
  Login
);
