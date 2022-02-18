import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Form, Input, message, Checkbox, Steps } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  SmileOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { registerUser } from "../../actions/auth";
import { listLocation } from "../../actions/location";
import { Link } from "react-router-dom";
import { Header, Footer } from "../../components/template";
import LocationForm from "./register_location_form";

const { Step } = Steps;

const SignupForm = ({ onSubmit, invId }) => {
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
    if (!values.agree_policy) return;
    values.invId = invId || null;
    onSubmit(values);
  };

  return (
    <Form name="register" className="register-form" onFinish={onFinish}>
      <React.Fragment>
        <span className="form-label">First name</span>
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
        <span className="form-label">Last name</span>
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
      </React.Fragment>
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
        <Input size="large" type="email" placeholder="Email" />
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
        <Input size="large" type="password" placeholder="Password" />
      </Form.Item>
      <span className="form-label">Confirm password</span>
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
      <Form.Item name="agree_policy" valuePropName="checked">
        <Checkbox>
          <span className="checkbox-label w-form-label">
            I agree to receive exclusive personalised event invitations,
            carefully created offers and promotions from RSG Consulting by
            email. For more information about how RSG processes your data,
            please see their Privacy Policy{" "}
            <a
              href="http://www.rsgconsulting.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .<br />‍<br />
            RSG Consulting Limited is a primary data controller and will process
            your personal data on a separate, independent basis. The Financial
            Times will also process data about entries and winners of the
            Collaboration Award. &nbsp;For more information please read the{" "}
            <a
              href="https://help.ft.com/legal-privacy/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Financial Times Privacy Policy
            </a>
            . <br />
            <br />
            The full submission guidelines and terms &amp; conditions for
            participating are available online{" "}
            <a
              href="https://www.ft.com/content/b0962e9a-f779-4c5f-84cd-3603f2ccab9e"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .<br />
          </span>
        </Checkbox>
      </Form.Item>

      <div className="signup-btn">
        <button type="submit" className="hk_button">
          Continue
        </button>
      </div>
      <div className="mt-5 v-center">
        <LeftOutlined />
        <Link to="/">&nbsp; RETURN TO HOME</Link>
      </div>
    </Form>
  );
};

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {},
      step: 0,
    };
  }

  componentDidMount = () => {
    this.props.listLocation();
  };

  onContinue = (values) => {
    this.setState({ values, step: 1 });
  };

  onSubmit = (values) => {
    this.props.registerUser(values);
    this.setState({ step: 2 });
  };

  onBack = () => {
    this.setState({ values: {}, step: 0 });
  };

  render() {
    const { values, step } = this.state;
    const { loc } = this.props;
    const params = new URLSearchParams(this.props.location.search);
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="invite-box mt-5">
            <h3 className="summary-title text-center mb-4">
              <b>REGISTER</b>
            </h3>
            <Steps className="mt-5 mb-4">
              <Step
                status={step > 0 ? "finish" : "process"}
                title="Participant"
                icon={<UserOutlined />}
              />
              <Step
                status={step === 0 ? "wait" : step === 1 ? "process" : "finish"}
                title="Location"
                icon={<SolutionOutlined />}
              />
              <Step
                status={step < 2 ? "wait" : "process"}
                title="Done"
                icon={<SmileOutlined />}
              />
            </Steps>
            {step === 0 && (
              <SignupForm
                onSubmit={this.onContinue}
                invId={params.get("inv_id")}
              />
            )}
            {step > 0 && (
              <LocationForm
                onSubmit={this.onSubmit}
                userInfo={values}
                locations={loc.locations}
                onBack={this.onBack}
              />
            )}
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
    fields: state.profile,
    loc: state.loc,
  };
}

export default connect(mapStateToProps, {
  registerUser,
  listLocation,
})(Register);
