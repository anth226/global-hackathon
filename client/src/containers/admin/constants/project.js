import React from "react";
import { connect } from "react-redux";
import { Input, Button } from "antd";
import ConstSection from "./section";
import {
  getTargetFieldName,
  getTargetLabelFromSection,
  processTargetSectionName,
  randomColor,
} from "../../../utils/helper";
import { deleteFieldData, createFieldData } from "../../../actions/profile";
import ListColumn from "./list-column";

class ProjectData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      namelist: getTargetFieldName("project", props.fieldData),
      newsection: "",
    };
  }

  onAddNewSection = () => {
    const { namelist, newsection } = this.state;
    if (!newsection) return;
    namelist.push(processTargetSectionName("project", newsection));
    this.setState({ namelist, newsection: "" });
  };

  render() {
    const { namelist, newsection } = this.state;
    return (
      <div className="admin-const" tabIndex="-1">
        <h5>{this.props.label.titleProject} constants</h5>
        {namelist.map((name, i) => (
          <ConstSection
            fieldName={name}
            label={getTargetLabelFromSection("project", name)}
            color={randomColor(i)}
            key={i}
          />
        ))}
        <div className="profile-add-section">
          <Input
            value={newsection}
            onChange={(e) => this.setState({ newsection: e.target.value })}
          />
          <Button type="primary" onClick={this.onAddNewSection}>
            Add New Field
          </Button>
        </div>
        <ListColumn field={"proj_column"} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData, label: state.label };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  ProjectData
);
