import React from "react";
import { connect } from "react-redux";
import Logo from "../../assets/img/logo-dark.png";
import { Header, Footer } from "../../components/template";
import { resendVerification } from "../../actions/auth";
import { Link } from "react-router-dom";

class Resend extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="login-page">
          <img className="mt-4 mb-2" src={Logo} alt="logo" />
          <h1 className="mt-3 mb-4">Email Confirmation</h1>
          <p>
            We have sent an email to the address you provided. <b>Please check your junk/spam folder in case it is caught in there.</b> After receiving
            the email, follow the link to complete your registration.
          </p>
          <br />
          <hr />
          <p>
            If you haven't received that email within a few minutes, please click{" "}
            <Link className="verify-link" to="#" onClick={this.props.resendVerification}>
              here
            </Link>{" "}
            to resend it
          </p>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
  };
}

export default connect(mapStateToProps, { resendVerification })(Resend);
