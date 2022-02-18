import React, { Component } from "react";
import { connect } from "react-redux";
import { updateLocation } from "../../actions/location";
import { Form, Input, Radio, Space, Button, Select } from "antd";
import { countries } from "../../constants/countries";
import { Col, Row } from "reactstrap";

const LocationForm = ({ onSubmit, location }) => {
  const onFinish = (values) => {
    values._id = location._id;
    values.status = location.status;
    values.before_helped = values.before_helped || "Yes";
    values.have_condition = values.have_condition || "Yes";
    values.have_help = values.have_help || "Yes";
    values.hosted_2019 = values.hosted_2019 || "Yes";
    values.multi_city = values.multi_city || "Yes";
    values.support_food = values.support_food || "Yes";
    onSubmit(values);
  };

  const vRadioGroup = (
    <Radio.Group size="large" defaultValue="Yes">
      <Space direction="vertical">
        <Radio value={"Yes"}>Yes</Radio>
        <Radio value={"No"}>No</Radio>
        <Radio value={"Not Sure"}>Not Sure</Radio>
      </Space>
    </Radio.Group>
  );

  return (
    <Form
      name="locationform"
      className="mt-4"
      onFinish={onFinish}
      initialValues={{ ...location }}
    >
      <Row>
        <Col md={6} sm={12}>
          <span className="form-label">Hosting Venue Name*</span>
          <Form.Item
            name="venue"
            rules={[
              {
                required: true,
                message: "Please input venue!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <span className="form-label">
            Organization interested in hosting*
          </span>
          <Form.Item
            name="organization"
            rules={[
              {
                required: true,
                message: "Please input organization!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col md={6} sm={12}>
          <span className="form-label">Proposed Venue Country</span>
          <Form.Item name="venue_country">
            <Select size="large" showSearch>
              {countries.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <span className="form-label">Venue City</span>
          <Form.Item name="venue_city">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col md={6} sm={12}>
          <span className="form-label">Venue Street Address</span>
          <Form.Item name="venue_street">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <span className="form-label">Venue postal or ZIP code</span>
          <Form.Item name="venue_zip">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <span className="form-label">Job title*</span>
      <Form.Item
        name="job_title"
        rules={[
          {
            required: true,
            message: "Please input job title!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <span className="form-label">
        Did your organization host the GLH 2019?
      </span>
      <Form.Item name="hosted_2019">{vRadioGroup}</Form.Item>
      <span className="form-label">
        Does the proposed venue have ample access to electrical outlets and high
        quality internet connections?
      </span>
      <Form.Item name="have_condition">{vRadioGroup}</Form.Item>
      <span className="form-label">
        How many participants can the proposed venue host?*
      </span>
      <Form.Item
        name="participants_number"
        rules={[
          {
            required: true,
            message: "Please input participants number!",
          },
        ]}
      >
        <Input size="large" type="number" />
      </Form.Item>
      <span className="form-label">
        Do you have help to organize, ie. volunteers, team members, other
        committed parties?
      </span>
      <Form.Item name="have_help">{vRadioGroup}</Form.Item>
      <span className="form-label">
        Have you helped to organize a hackathon before?
      </span>
      <Form.Item name="before_helped">
        <Radio.Group size="large" defaultValue="Yes">
          <Space direction="vertical">
            <Radio value={"Yes"}>Yes</Radio>
            <Radio value={"No"}>No</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
      <span className="form-label">
        Will your proposed host organization be able to support food and
        beverage supplies for hackathon participants at your venue, or will you
        need additional sponsorship?
      </span>
      <Form.Item name="support_food">{vRadioGroup}</Form.Item>
      <span className="form-label">
        Does your organization want to host in Multiple Cities?(If marked yes,
        please fill out an application for each location you want to host at.)
      </span>
      <Form.Item name="multi_city">{vRadioGroup}</Form.Item>
      {/* <span className="form-label">Venue homepage content</span>
      <Form.Item name="content">
        <RichTextEditor />
      </Form.Item> */}
      <Button type="primary" htmlType="submit" className="mt-5 mb-4">
        Submit
      </Button>
    </Form>
  );
};

class LocationProfile extends Component {
  onSubmit = async (locData) => {
    const { updateLocation, onNext } = this.props;
    await updateLocation(locData);
    onNext();
  };

  render = () => {
    return (
      <LocationForm onSubmit={this.onSubmit} location={this.props.location} />
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  updateLocation,
})(LocationProfile);
