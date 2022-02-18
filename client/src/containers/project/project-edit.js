import React, { Component } from "react";
import { connect } from "react-redux";
import { Skeleton } from "antd";
import {
  updateProject,
  getProject,
  listProjectDetails,
} from "../../actions/project";
import EditProjForm from "../../components/project/create_project";

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      curProject: {},
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const curProject = await this.props.getProject(this.props.id);
    this.setState({ loading: false, curProject });
  };

  updateProject = async (projData) => {
    await this.props.updateProject(projData);
    this.props.hideModal();
    this.props.listProjectDetails();
  };

  render = () => {
    const { loading, curProject } = this.state;
    const { hideModal, label, fieldData } = this.props;

    return (
      <div className="login-page">
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && curProject._id && (
          <EditProjForm
            onSubmit={this.updateProject}
            curProject={curProject}
            hideProjectCreate={hideModal}
            label={label}
            fieldData={fieldData}
          />
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listProjectDetails,
  updateProject,
  getProject,
})(EditProject);
