import React from "react";
import { connect } from "react-redux";
import { Input, Button, Popover, message, Radio } from "antd";
import { Row, Col } from "reactstrap";
import { deleteFieldData, createFieldData } from "../../../actions/profile";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newPf: "",
      newOf: "",
      radioValue: "text",
      loading: false,
    };
  }

  onChangePField = (e) => {
    this.setState({ newPf: e.target.value });
  };

  onChangeOField = (e) => {
    this.setState({ newOf: e.target.value });
  };

  onChangeRadio = (e) => {
    this.setState({ radioValue: e.target.value });
  };

  onAddPField = () => {
    const { newPf, radioValue } = this.state;
    if (!newPf || newPf.length < 3) {
      message.warn("Field Name should be more than 3 in length");
      return;
    }
    this.props.createFieldData({
      field: "userform_attr",
      value: newPf,
      option: radioValue,
    });
    this.setState({ newPf: "" });
  };

  onAddOField = () => {
    const { newOf, radioValue } = this.state;
    if (!newOf || newOf.length < 3) {
      message.warn("Field Name should be more than 3 in length");
      return;
    }
    this.props.createFieldData({
      field: "orgform_attr",
      value: newOf,
      option: radioValue,
    });
    this.setState({ newOf: "" });
  };

  onDeleteField = async (id) => {
    this.setState({ loading: true });
    await this.props.deleteFieldData(id);
    this.setState({ loading: false });
  };

  render() {
    const { label, fieldData } = this.props;
    const { newPf, newOf, radioValue } = this.state;
    const pfields = fieldData.filter((fd) => fd.field === "userform_attr");
    const ofields = fieldData.filter((fd) => fd.field === "orgform_attr");
    return (
      <div className="admin-const" tabIndex="-1">
        <h5 className="mb-5">Profile Attributes</h5>
        <Row>
          <Col md={6}>
            <p>
              <b>{label.titleParticipant}</b>
            </p>
            {pfields.map((pf) => (
              <div key={pf._id} className="profile-form-item">
                <Input
                  value={
                    pf.option === "richtext"
                      ? `${pf.value} (richtext)`
                      : pf.value
                  }
                  disabled
                />
                <MinusCircleOutlined
                  onClick={() => this.onDeleteField(pf._id)}
                />
              </div>
            ))}
            <div className="profile-form-item">
              <Popover
                content={
                  <React.Fragment>
                    <Radio.Group
                      onChange={this.onChangeRadio}
                      value={radioValue}
                      className="mb-3"
                    >
                      <Radio value={"text"}>Text</Radio>
                      <Radio value={"richtext"}>RichText</Radio>
                    </Radio.Group>
                    <div className="flex">
                      <Input value={newPf} onChange={this.onChangePField} />
                      <Button type="primary" onClick={this.onAddPField}>
                        Add
                      </Button>
                    </div>
                  </React.Fragment>
                }
                title="Add field"
                trigger="click"
              >
                <Button type="dashed">
                  <PlusOutlined /> Add field
                </Button>
              </Popover>
            </div>
          </Col>
          <Col md={6}>
            <p>
              <b>{label.titleOrganization}</b>
            </p>
            {ofields.map((of) => (
              <div key={of._id} className="profile-form-item">
                <Input
                  value={
                    of.option === "richtext"
                      ? `${of.value} (richtext)`
                      : of.value
                  }
                  disabled
                />
                <MinusCircleOutlined
                  onClick={() => this.onDeleteField(of._id)}
                />
              </div>
            ))}
            <div className="profile-form-item">
              <Popover
                content={
                  <React.Fragment>
                    <Radio.Group
                      onChange={this.onChangeRadio}
                      value={radioValue}
                      className="mb-3"
                    >
                      <Radio value={"text"}>Text</Radio>
                      <Radio value={"richtext"}>RichText</Radio>
                    </Radio.Group>
                    <div className="flex">
                      <Input value={newOf} onChange={this.onChangeOField} />
                      <Button type="primary" onClick={this.onAddOField}>
                        Add
                      </Button>
                    </div>
                  </React.Fragment>
                }
                title="Add field"
                trigger="click"
              >
                <Button type="dashed">
                  <PlusOutlined /> Add field
                </Button>
              </Popover>
            </div>
          </Col>
          <Col md={6}></Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData, label: state.label };
}

export default connect(mapStateToProps, { deleteFieldData, createFieldData })(
  ProfileForm
);
