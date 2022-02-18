import React, { Component } from "react";
import { connect } from "react-redux";
import { createOrgInvite, updateOrgInvite } from "../../actions/orginvite";
import { Form, Input, Button } from "antd";

const InvMemberForm = ({ onSubmit, orgInvite }) => {
  const onFinish = (values) => {
    values._id = orgInvite._id;
    values.organization = orgInvite.organization;
    values.role = "Member";
    onSubmit(values);
  };

  return (
    <Form
      name="org_register"
      className="mt-4"
      onFinish={onFinish}
      initialValues={{ ...orgInvite }}
    >
      <span className="form-label">Name</span>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <span className="form-label">Email</span>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input the email!",
          },
        ]}
      >
        <Input size="large" type="email" />
      </Form.Item>
      <Button
        type="ghost"
        htmlType="submit"
        className="black-btn mt-4"
        style={{ marginLeft: "auto" }}
      >
        Submit
      </Button>
    </Form>
  );
};

class EditMemberInvite extends Component {
  createAndUpdateInvite = async (invData) => {
    const { createOrgInvite, updateOrgInvite, onNext } = this.props;
    if (!invData._id) {
      await createOrgInvite(invData);
    } else {
      await updateOrgInvite(invData);
    }
    onNext();
  };

  render = () => {
    const { orgInvite } = this.props;
    return (
      <InvMemberForm
        onSubmit={this.createAndUpdateInvite}
        orgInvite={orgInvite}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  createOrgInvite,
  updateOrgInvite,
})(EditMemberInvite);
