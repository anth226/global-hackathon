import React, { Component } from "react";
import { connect } from "react-redux";
import { updateLocation } from "../../actions/location";
import LocationForm from "./location-form";

class LocationProfile extends Component {
  onSubmit = async (locData) => {
    const { updateLocation, onNext } = this.props;
    await updateLocation(locData);
    onNext();
  };

  render = () => {
    return (
      <LocationForm onSubmit={this.onSubmit} location={this.props.location} />
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  updateLocation,
})(LocationProfile);
