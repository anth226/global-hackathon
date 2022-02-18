import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getChallenge,
  updateChallenge,
  createChallenge,
  adminListChallenge,
} from "../../../actions/challenge";
import { Skeleton } from "antd";
import EditChallengeForm from "../../../components/organization/create-challenge";

class EditChallenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      curChallenge: {},
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const curChallenge = await this.props.getChallenge(this.props.id);
    this.setState({ loading: false, curChallenge });
  };

  updateChallenge = async (chlData) => {
    await this.props.updateChallenge(chlData);
    this.props.hideModal();
  };

  render = () => {
    const { loading, curChallenge } = this.state;

    return (
      <div className="login-page">
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && curChallenge._id && (
          <EditChallengeForm
            updateChallenge={this.updateChallenge}
            curChallenge={curChallenge}
            fieldData={this.props.fieldData}
            label={this.props.label}
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
  getChallenge,
  updateChallenge,
  createChallenge,
  adminListChallenge,
})(EditChallenge);
