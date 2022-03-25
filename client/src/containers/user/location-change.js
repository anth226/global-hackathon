import React, { Component } from "react";
import { message } from "antd";
import { connect } from "react-redux";
import history from "../../history";
import { Header, Footer } from "../../components/template";
import { listLocation } from "../../actions/location";
import { ChooseLocationForm } from "../identity/forms";
import {
  updateUserAddress,
  updateUserLocation,
  protectedTest,
} from "../../actions/auth";

class UpdateLocationPage extends Component {
  componentDidMount = () => {
    this.props.listLocation();
  };

  onUpdateAddress = async (data) => {
    await this.props.updateUserAddress(
      data.country,
      data.city,
      this.props.user.email
    );
  };

  onSelectLocation = async (locationId) => {
    await this.props.updateUserLocation(locationId, this.props.user.email);
    message.success("Host location has been changed successfully!");
    await this.props.protectedTest();
    history.push("/dashboard");
  };

  render = () => {
    return (
      <React.Fragment>
        <Header />
        <div className="identity-container">
          <ChooseLocationForm
            onSubmit={this.onSelectLocation}
            locations={this.props.loc.locations}
            onSetLocation={this.onUpdateAddress}
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
    loc: state.loc,
  };
}

export default connect(mapStateToProps, {
  updateUserLocation,
  updateUserAddress,
  listLocation,
  protectedTest,
})(UpdateLocationPage);
