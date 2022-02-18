import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Row, Col, Checkbox, Button } from "antd";
import { Link } from "react-router-dom";
import { Header } from "../../components/template";
import { loginUser, resendVerification } from "../../actions/auth";
import history from "../../history";
import HomeBoard from "../home/homeboard";

const LoginForm = ({ onSubmit }) => {
  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
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
        <Checkbox>Remember me</Checkbox>
        <Link to="/forgot-password/user">Forgot password</Link>
      </div>
      <button type="submit" className="glh-btn-blue-full">
        Log in
      </button>
      <div className="mt-3 center">
        <Button type="link" onClick={() => history.push("/identity")}>
          Login with GLH Private Key
        </Button>
      </div>
    </Form>
  );
};

class Identity extends Component {
  componentDidMount = () => {
    const { authenticated, user } = this.props;
    if (authenticated && user.profile) {
      history.push("/dashboard");
    }
  };

  render() {
    const { loginUser, resendVerification } = this.props;
    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <Container>
            <h1>
              Log into existing <span className="green-grad">#GLH2022</span>{" "}
              account
            </h1>
            <Row gutter={30} className="mt-5">
              <Col lg={15} md={12} sm={24} xs={24} className="mb-4">
                <div className="item-block">
                  <LoginForm onSubmit={loginUser} resend={resendVerification} />
                </div>
              </Col>
              <Col lg={9} md={12} sm={24} xs={24} className="mb-4">
                <div className="green-block">
                  <h5>Don't have a GLH Private Key yet?</h5>
                  <div className="register-box">
                    <Link
                      className="glh-btn-default-wide"
                      to="/identity-register"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {
  loginUser,
  resendVerification,
})(Identity);
