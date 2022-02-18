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

class GalleryData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      namelist: getTargetFieldName("gallery", props.fieldData),
      newsection: "",
    };
  }

  onAddNewSection = () => {
    const { namelist, newsection } = this.state;
    if (!newsection) return;
    namelist.push(processTargetSectionName("gallery", newsection));
    this.setState({ namelist, newsection: "" });
  };

  render() {
    const { namelist, newsection } = this.state;
    return (
      <div className="admin-const" tabIndex="-1">
        <h5>{this.props.label.titleGallery} constants</h5>
        {namelist.map((name, i) => (
          <ConstSection
            fieldName={name}
            label={getTargetLabelFromSection("gallery", name)}
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData, label: state.label };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  GalleryData
);
