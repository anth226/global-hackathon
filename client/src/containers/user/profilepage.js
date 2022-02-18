import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Footer } from "../../components/template";
import { updateProfile } from "../../actions/auth";
import ProfileForm from "./profile-form";
import history from "../../history";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = { avatarURL: "" };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  onUpdateProfile = async (profile) => {
    await this.props.updateProfile({ profile });
    history.push("/dashboard");
  };

  render = () => {
    const { user, fieldData } = this.props;
    let profile = user.profile || {};
    profile.email = user.email;

    return (
      <React.Fragment>
        <Header />
        <div className="container content">
          <ProfileForm
            onSubmit={this.onUpdateProfile}
            profile={profile}
            setAvatar={this.setAvatar}
            avatarURL={this.state.avatarURL || profile.photo}
            fieldData={fieldData}
          />
        </div>
        <Footer />
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, { updateProfile })(ProfilePage);
