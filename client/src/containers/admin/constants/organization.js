import React from "react";
import { connect } from "react-redux";
import ConstSection from "./section";
import { deleteFieldData, createFieldData } from "../../../actions/profile";
import ListColumn from "./list-column";

class OrgData extends React.Component {
  render() {
    const { label } = this.props;

    return (
      <div className="admin-const" tabIndex="-1">
        <h5>{this.props.label.titleOrganization} constants</h5>
        <ConstSection
          fieldName={"org_type"}
          label={`${label.titleOrganization} Type`}
          color={"blue"}
        />
        <ListColumn field={"org_column"} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData, label: state.label };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  OrgData
);
