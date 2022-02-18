import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { updateFieldData } from "../../../actions/profile";
import RichTextEditor from "../../../components/pages/editor";
import { getOneFieldData } from "../../../utils/helper";

class ChallengeRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: getOneFieldData(this.props.fieldData, "chl_rule")
    };
  }

  onChangeRule = (value) => {
    this.setState({ value });
  };

  onSaveRule = () => {
    const { updateFieldData } = this.props;
    updateFieldData({ field: "chl_rule", value: this.state.value });
  }

  render() {
    return (
      <div className="admin-intro-block mt-5">
        <span>Challenge Rule</span>
        <RichTextEditor
          placeholder="Challenge Rule"
          onChange={this.onChangeRule}
          value={this.state.value}
        />
        <Button
          type="primary"
          style={{ float: "right" }}
          className="mt-2 mb-5"
          onClick={this.onSaveRule}
        >
          Save Rule
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, { updateFieldData })(ChallengeRule);
