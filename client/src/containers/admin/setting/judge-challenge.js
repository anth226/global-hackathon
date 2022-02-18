import React from "react";
import { connect } from "react-redux";
import { FormOutlined } from "@ant-design/icons";
import { Popover, Button, Select } from "antd";
import { updateJudgeChallenge } from "../../../actions/admin";
const { Option } = Select;

class JudgeChallenge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      // role: this.props.cell,
      integra_id: "",
    };
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  hidePopOver = () => {
    this.setState({
      visible: false,
    });
  };

  handleChallengeChange = (value) => {
    this.setState({ integra_id: value });
  };

  submitChallengeChange = () => {
    this.props.updateJudgeChallenge(this.props.row._id, this.state.integra_id);
    this.hidePopOver();
  };

  render() {
    const { cell, challenge } = this.props;
    const challenges = challenge.adminChallenges || [];
    return (
      <div style={{ display: "flex" }}>
        <span>{cell}</span>
        <Popover
          content={
            <React.Fragment>
              <Select
                style={{ width: "100%", minWidth: "300px" }}
                defaultValue={cell}
                onChange={this.handleChallengeChange}
              >
                {challenges.map((chl) => (
                  <Option key={chl._id} value={chl.challenge_name}>
                    {chl.challenge_name}
                  </Option>
                ))}
              </Select>
              <div className="mt-2" style={{ display: "flex" }}>
                <Button type="link" onClick={this.hidePopOver}>
                  Close
                </Button>
                <Button type="link" onClick={this.submitChallengeChange}>
                  Save
                </Button>
              </div>
            </React.Fragment>
          }
          title="Role"
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button type="link" className="column-btn">
            <FormOutlined />
          </Button>
        </Popover>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin, challenge: state.challenge };
}

export default connect(mapStateToProps, { updateJudgeChallenge })(
  JudgeChallenge
);
