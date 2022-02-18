import React, { useState } from "react";
import { Form, Radio, Space, Button, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import LocationProfile from "../../components/pages/location-profile";

const LocationForm = ({ onSubmit, userInfo, locations, onBack }) => {
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState({});

  const onHideModal = () => {
    setVisible(false);
    setLocation({});
  };

  const onOpenModal = (location) => {
    setVisible(true);
    setLocation(location);
  };

  const onFinish = async (values) => {
    userInfo.location = values.location;
    onSubmit(userInfo);
  };

  return (
    <Form name="locationform" className="register-form" onFinish={onFinish}>
      <div className="location-select-box">
        <Form.Item
          name="location"
          rules={[
            {
              required: true,
              message: "Please select location!",
            },
          ]}
        >
          <Radio.Group size="large" style={{width: "100%"}}>
            <Space direction="vertical" className="location-item">
              {locations.map((loc) => (
                <Radio key={loc._id} value={loc._id}>
                  <p>
                    <b>{loc.venue}</b>
                    <Link
                      to="#"
                      onClick={() => onOpenModal(loc)}
                      className="pl-3"
                    >
                      <EyeOutlined />
                    </Link>
                  </p>
                  <span>
                    {loc.organization} ({loc.venue_street}, {loc.venue_city},{" "}
                    {loc.venue_zip}, {loc.venue_country})
                  </span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
      </div>

      <div className="register-btnbox">
        <Button type="default" htmlType="button" onClick={onBack}>
          Back
        </Button>
        <Button type="default" htmlType="submit">
          Submit
        </Button>
      </div>
      {visible && (
        <Modal
          title={"Location Profile"}
          visible={visible}
          width={900}
          footer={false}
          onCancel={onHideModal}
        >
          <LocationProfile location={location} />
        </Modal>
      )}
    </Form>
  );
};

export default LocationForm;
