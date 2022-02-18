import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateOrganization,
  createOrganization,
} from "../../actions/organization";
import { getFieldData, processLink } from "../../utils/helper";
import { Form, Input, Select, Button } from "antd";
import { Col, Row } from "reactstrap";
import { countries } from "../../constants/countries";
import { BigUpload } from "../../components/template";

const OrgEditForm = ({
  onSubmit,
  orgTypes,
  setAvatar,
  avatarURL,
  org,
  label,
}) => {
  const onFinish = (values) => {
    values._id = org._id;
    values.logo = avatarURL;
    values.website = processLink(values.website);
    onSubmit(values);
  };

  return (
    <Form
      name="org_register"
      className="mt-5"
      onFinish={onFinish}
      initialValues={{ ...org }}
    >
      <Row>
        <Col md={6} sm={12}>
          <div className="center mb-4">
            <BigUpload setAvatar={setAvatar} imageUrl={avatarURL} />
          </div>
        </Col>
        <Col md={6} sm={12}>
          <div className="divid-head">
            <span>General Information</span>
          </div>
          <hr />
          <span className="form-label">{label.titleOrganization} name</span>
          <Form.Item
            name="org_name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <span className="form-label">{label.titleOrganization} type</span>
          <Form.Item
            name="org_type"
            rules={[
              {
                required: true,
                message: "Please choose the type!",
              },
            ]}
          >
            <Select size="large">
              {orgTypes.length > 0 &&
                orgTypes.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.value}>
                      {item.value}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <span className="form-label">{label.titleOrganization} website</span>
          <Form.Item name="website">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <div className="divid-head">
        <span>Location Information</span>
      </div>
      <hr />
      <Row>
        <Col md={6} sm={12}>
          <span className="form-label">Address</span>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please input the address!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <span className="form-label">City</span>
          <Form.Item name="city">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <span className="form-label">Country</span>
          <Form.Item name="country">
            <Select size="large" showSearch>
              {countries.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <span className="form-label">State</span>
          <Form.Item name="state">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <div className="divid-head">
        <span>{label.titleOrganization} contact information</span>
      </div>
      <hr />
      <Row>
        <Col md={6} sm={12}>
          <span className="form-label">Contact name</span>
          <Form.Item name="contact_name">
            <Input size="large" />
          </Form.Item>
          <span className="form-label">Contact phone</span>
          <Form.Item name="contact_phone">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <span className="form-label">Contact email</span>
          <Form.Item
            name="contact_email"
            rules={[
              {
                type: "email",
                message: "The input is not valid Email!",
              },
              {
                required: true,
                message: "Please input the contact Email!",
              },
            ]}
          >
            <Input size="large" type="email" />
          </Form.Item>
        </Col>
      </Row>
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

class EditOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: this.props.org.logo,
    };
  }

  setAvatar = (url) => {
    this.setState({ avatarURL: url });
  };

  createAndUpdateOrg = async (orgData) => {
    const { updateOrganization, createOrganization, onNext } = this.props;
    if (!orgData._id) {
      await createOrganization(orgData);
    } else {
      await updateOrganization(orgData);
    }
    onNext();
  };

  render = () => {
    const { fieldData, org, label } = this.props;
    const orgTypes = getFieldData(fieldData, "org_type");

    return (
      <OrgEditForm
        onSubmit={this.createAndUpdateOrg}
        orgTypes={orgTypes}
        setAvatar={this.setAvatar}
        avatarURL={this.state.avatarURL || org.logo}
        org={org}
        label={label}
      />
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
  updateOrganization,
  createOrganization,
})(EditOrg);
