import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { updateFieldData } from "../../../actions/profile";
import RichTextEditor from "../../../components/pages/editor";
import { getOneFieldData } from "../../../utils/helper";

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: getOneFieldData(this.props.fieldData, this.props.field)
    };
  }

  onChangeIntro = (value) => {
    this.setState({ value });
  };

  onSaveIntro = () => {
    const { updateFieldData, field } = this.props;
    updateFieldData({ field, value: this.state.value });
  }

  render() {
    return (
      <div className="admin-intro-block mt-5">
        <span>Introduction</span>
        <RichTextEditor
          placeholder="Indroduction"
          onChange={this.onChangeIntro}
          value={this.state.value}
        />
        <Button
          type="primary"
          style={{ float: "right" }}
          className="mt-2 mb-5"
          onClick={this.onSaveIntro}
        >
          Save Intro
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, { updateFieldData })(Intro);
