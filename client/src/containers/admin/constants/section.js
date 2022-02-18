import React from "react";
import { connect } from "react-redux";
import { getFieldData } from "../../../utils/helper";
import { Input, Button, Tag } from "antd";
import { deleteFieldData, createFieldData } from "../../../actions/profile";

class ConstSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      [props.fieldName]: "",
    };
  }

  handleRemove = (fieldItem) => {
    this.props.deleteFieldData(fieldItem._id);
  };

  onAddNewItem = (field, value) => {
    if (!value) return;
    this.props.createFieldData({ field, value });
    this.setState({ [this.props.fieldName]: "" });
  };

  render() {
    const { fieldData, fieldName, label, color } = this.props;
    const fieldList = getFieldData(fieldData, fieldName);

    return (
      <div className="const-block">
        <div className="const-header">
          <span className="const-label">{label}</span>
          <div className="add-box">
            <Input
              size="small"
              value={this.state[fieldName]}
              onChange={(e) => this.setState({ [fieldName]: e.target.value })}
            />
            <Button
              type="primary"
              size="small"
              onClick={() =>
                this.onAddNewItem(fieldName, this.state[fieldName])
              }
            >
              Add {label}
            </Button>
          </div>
        </div>
        <div className="const-field">
          {fieldList.map((s) => (
            <Tag
              key={s._id}
              color={color}
              closable
              onClose={() => this.handleRemove(s)}
            >
              {s.value}
            </Tag>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  ConstSection
);
