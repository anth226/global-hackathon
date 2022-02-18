import React from "react";
import { connect } from "react-redux";
import { FormOutlined } from "@ant-design/icons";
import { Popover, Button, Select } from "antd";
import { updateRole } from "../../../actions/admin";

const { Option } = Select;

class ColumnRole extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      role: this.props.cell,
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

  handleRoleChange = (value) => {
    this.setState({ role: value });
  };

  submitRoleChange = () => {
    this.props.updateRole(this.props.row._id, this.state.role);
    this.hidePopOver();
  };

  render() {
    const { cell } = this.props;
    return (
      <div style={{ display: "flex" }}>
        <span>{cell}</span>
        <Popover
          content={
            <React.Fragment>
              <Select
                style={{ width: "100%" }}
                defaultValue={cell}
                onChange={this.handleRoleChange}
              >
                <Option value="Member">Member</Option>
                <Option value="Admin">Admin</Option>
                <Option value="Restrict">Restrict</Option>
                <Option value="Block">Block</Option>
              </Select>
              <div className="mt-2" style={{ display: "flex" }}>
                <Button type="link" onClick={this.hidePopOver}>
                  Close
                </Button>
                <Button type="link" onClick={this.submitRoleChange}>
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
  return { admin: state.admin };
}

export default connect(mapStateToProps, { updateRole })(ColumnRole);
