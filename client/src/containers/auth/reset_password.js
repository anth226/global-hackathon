import React, { Component } from "react";
import { connect } from "react-redux";
import { resetPassword, resetPasswordSecurity } from "../../actions/auth";
import { Header } from "../../components/template";
import { Form, Input, Button } from "antd";
import HomeBoard from "../home/homeboard";
import history from "../../history";

const ResetPasswordForm = ({ resetPassword, resetPasswordSecurity, token }) => {
  const onFinish = (values) => {
    if (token && token.includes("security")) {
      let userid = token.replace("security", "");
      resetPasswordSecurity(userid, values.password, values.conf_password);
    } else {
      resetPassword(token, values.password, values.conf_password);
    }
  };

  return (
    <Form name="reset" className="general-form" onFinish={onFinish}>
      <div className="form-header">
        <h5>Reset Password</h5>
      </div>
      <div className="form-body">
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
        <button type="submit" className="glh-btn-blue-full">
          Reset Password
        </button>
        <div className="mt-3 center">
          <Button type="link" onClick={() => history.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </Form>
  );
};

class ResetPassword extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      this.context.router.push("/");
    }
  }

  render() {
    const { resetPassword, resetPasswordSecurity, match } = this.props;
    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <ResetPasswordForm
            resetPassword={resetPassword}
            resetPasswordSecurity={resetPasswordSecurity}
            token={match.params.resetToken}
          />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.resetMessage };
}

export default connect(mapStateToProps, {
  resetPassword,
  resetPasswordSecurity,
})(ResetPassword);
