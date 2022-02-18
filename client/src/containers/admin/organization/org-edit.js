import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateOrganization,
  getOrganization,
  listOrgReport,
} from "../../../actions/organization";
import { getFieldData } from "../../../utils/helper";
import OrgEditForm from "../../organization/orgedit-form";
import { Skeleton } from "antd";

class EditOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: "",
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.props.getOrganization(this.props.id);
    this.setState({ loading: false });
  };

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  updateOrg = async (orgData) => {
    await this.props.updateOrganization(orgData);
    this.props.hideModal();
    this.props.listOrgReport();
  };

  render = () => {
    const { fieldData, organization, label, id } = this.props;
    const orgTypes = getFieldData(fieldData, "org_type");
    const { avatarURL, loading } = this.state;
    const org = organization.currentOrganization;

    return (
      <div className="login-page">
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && org._id === id && (
          <OrgEditForm
            onSubmit={this.updateOrg}
            orgTypes={orgTypes}
            setAvatar={this.setAvatar}
            avatarURL={avatarURL || org.logo}
            org={org}
            fieldData={fieldData}
            label={label}
          />
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    organization: state.organization,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  updateOrganization,
  getOrganization,
  listOrgReport,
})(EditOrg);
