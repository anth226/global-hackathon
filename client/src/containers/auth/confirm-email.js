import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo-dark.png";
import { Header, Footer } from "../../components/template";
import { confirmEmail } from "../../actions/auth";

class ConfirmEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: "",
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    let message = await this.props.confirmEmail({
      token: this.props.match.params.token,
      mode: this.props.match.params.mode,
    });
    this.setState({ message, loading: false });
  };

  render() {
    const { loading, message } = this.state;
    return (
      <React.Fragment>
        <Header />
        <div className="login-page">
          <img className="mt-4 mb-2" src={Logo} alt="logo" />
          <h1 className="mt-3 mb-5">Email Confirmation</h1>
          {loading && <h5>Verifing your accout ...</h5>}
          {!loading && <h5>{message}</h5>}
          {!loading && (
            <div className="verify-redirect">
              <Link className="hk_button" to={"/login"}>
                LogIn
              </Link>
            </div>
          )}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { confirmEmail })(ConfirmEmail);
