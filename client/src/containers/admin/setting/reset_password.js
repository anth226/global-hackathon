import React from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, CopyOutlined } from "@ant-design/icons";
import { adminResetPassword } from "../../../actions/auth";
import { Link } from "react-router-dom";

const ForgotForm = ({ sendMail }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    await sendMail(values.email);
    form.resetFields();
  };

  return (
    <Form name="forgot" form={form} className="forgot-form" onFinish={onFinish}>
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
      <button type="submit" className="covid-btn covid-success mt-5">
        Get Link
      </button>
    </Form>
  );
};

class SendForgotPassword extends React.Component {
  state = {
    email: "",
    link: "",
  };

  getResetPwdLink = async (email) => {
    const link = await this.props.adminResetPassword(email);
    this.setState({ email, link });
  };

  copyLink = (value) => {
    navigator.clipboard.writeText(value);
    message.success("Copied!");
  };

  render() {
    const { email, link } = this.state;
    return (
      <Container className="content">
        <div className="invite-box mt-5">
          <h3 className="summary-title text-center mb-4">
            Send Reset Password Email
          </h3>
          <ForgotForm sendMail={this.getResetPwdLink} />
          {link && (
            <div className="mt-5">
              <p>ResetPassword Link for the email "{email}":</p>
              <Link to="#">{link}</Link>
              <Button
                type="link"
                onClick={() => this.copyLink(link)}
                title="Copy"
              >
                <CopyOutlined />
              </Button>
            </div>
          )}
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  adminResetPassword,
})(SendForgotPassword);
