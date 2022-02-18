import React from "react";
import { connect } from "react-redux";
import ConstSection from "./section";
import { deleteFieldData, createFieldData } from "../../../actions/profile";
import ListColumn from "./list-column";

class ProfileData extends React.Component {
  render() {
    const { label } = this.props;

    return (
      <div className="admin-const" tabIndex="-1">
        <h5>{label.titleParticipant} constants</h5>
        <ConstSection
          fieldName={"user_role"}
          label={`${label.titleParticipant} Role`}
          color={"cyan"}
        />
        <ListColumn field={"ptp_column"} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData, label: state.label };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  ProfileData
);
