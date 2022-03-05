import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { Footer, Header } from "../../components/template";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Descriptions, Input, Modal, Skeleton } from "antd";

export default function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(undefined);
  const [isLoading, setisLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState(
    `Hello, \nThank you for your interest in attending this year's hackathon.`
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/location/${id}`)
      .then((res) => {
        setLocation(res.data);
        setisLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleMessage = async () => {
    axios
      .post(`${process.env.REACT_APP_API_HOST}/location/${id}/message`)
      .then((res) => {
        alert("Messages sent successfully.");
        setIsMessageModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <React.Fragment>
      <div className="h-screen">
        <Header />
        <Container>
          <div className="py-5">
            <div className="py-5" />
            {isLoading ? (
              <Skeleton />
            ) : (
              <div>
                <h2 className="pb-3">Location details</h2>
                <Descriptions column={2}>
                  <Descriptions.Item label="Venue">
                    {location?.venue || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Organization">
                    {location?.organization || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Venue Country">
                    {location?.venue_country || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Venue City">
                    {location?.venue_city || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Venue Street">
                    {location?.venue_street || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Venue Zipcode">
                    {location?.venue_zip || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total participants">
                    {location?.participants_number || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
            <div className="py-2">
              <button
                className="btn btn-primary"
                onClick={() => setIsMessageModalOpen(true)}
              >
                Mesage participants
              </button>
            </div>
          </div>
          <Modal
            onOk={handleMessage}
            okText={"Send message"}
            cancelText="Discard"
            title="Message location participants"
            visible={isMessageModalOpen}
            closable
            on
            onCancel={() => setIsMessageModalOpen(false)}
          >
            <Input.TextArea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              style={{ height: 200 }}
              placeholder="Message"
            />
          </Modal>
        </Container>
      </div>
      <Footer />
    </React.Fragment>
  );
}
