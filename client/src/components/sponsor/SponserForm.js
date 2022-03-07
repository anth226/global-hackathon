import React, { useEffect, useState } from "react";

import { Form, Input, Col, Button } from "antd";

const SponserForm = ({ setName, setOrigin, save, name, origin }) => {
  return (
    <Form
      name="add_sponsor"
      fields={[
        {
          name: ["name"],
          value: name,
        },
        {
          name: ["origin"],
          value: origin,
        },
      ]}
    >
      <Col md={12} sm={24}>
        <span className="form-label">Sponsor's Name</span>

        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name!",
            },
          ]}
        >
          <Input size="large" onChange={(e) => setName(e.target.value)} />
        </Form.Item>
      </Col>
      <Col md={12} sm={24}>
        <span className="form-label">Sponsor's Origin Country*</span>

        <Form.Item
          name="origin"
          rules={[
            {
              required: true,
              message: "Please input the origin!",
            },
          ]}
        >
          <Input size="large" onChange={(e) => setOrigin(e.target.value)} />
        </Form.Item>
      </Col>
      <Col>
        <Button
          type="ghost"
          htmlType="submit"
          className="black-btn mt-4"
          onClick={save}
        >
          Save
        </Button>
      </Col>
    </Form>
  );
};

export default SponserForm;
