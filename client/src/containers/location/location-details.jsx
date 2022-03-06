import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { Footer, Header } from "../../components/template";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Descriptions, Input, Modal, Skeleton } from "antd";
import axiosClient from "../../actions/api";
import { message as notification } from "antd";
import { connect } from "react-redux";

function LocationDetails({ user }) {
  const { id } = useParams();
  const [location, setLocation] = useState(undefined);
  const [news, setNews] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [message, setMessage] = useState(
    `Hello, \nThank you for your interest in attending this year's hackathon.`
  );

  const [article, setArticle] = useState({
    title: "",
    content: "",
    locationId: id,
  });

  const client = axiosClient(true);

  useEffect(() => {
    client
      .get(`${process.env.REACT_APP_API_HOST}/location/${id}`)
      .then((res) => {
        setLocation(res.data);
        setisLoading(false);
      })
      .catch((err) => console.error(err));

    client
      .get(`${process.env.REACT_APP_API_HOST}/news/location/${id}`)
      .then((res) => {
        setNews(res.data);
        setNewsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleMessage = async () => {
    client
      .post(`${process.env.REACT_APP_API_HOST}/location/${id}/message`, {
        message,
      })
      .then((res) => {
        notification.success("Messages sent successfully");
        setIsMessageModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  const handlePublishArticle = async () => {
    client
      .post(`${process.env.REACT_APP_API_HOST}/news`, article)
      .then((res) => {
        setNews([res.data.news, ...news]);
        notification.success("Messages sent successfully");
        setIsWriteModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <React.Fragment>
      <div className="min-h-screen">
        <Header />
        <Container>
          <div className="py-5">
            <div className="py-5" />
            {isLoading ? (
              <Skeleton />
            ) : (
              <div>
                <h2 className="text-primary font-weight-bold pb-3">
                  Location details
                </h2>
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
            {user?.profile?.location_role === "Admin" && (
              <div className="py-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  Mesage participants
                </button>
              </div>
            )}

            <div className="d-flex justify-content-between py-5">
              <h2 className="text-primary font-weight-bold">Latest news</h2>
              {user?.profile?.location_role === "Admin" && (
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => setIsWriteModalOpen(true)}
                  >
                    New article
                  </button>
                </div>
              )}
            </div>
            {newsLoading ? (
              [1, 2].map((i) => <Skeleton key={i} className="col-4" />)
            ) : news.length === 0 ? (
              <div className="pb-4 text-lg text-gray">
                No news published so far.
              </div>
            ) : (
              news.map((n) => (
                <div className="row py-3 ">
                  <div className="col-12 col-md-10 col-lg-8" key={n._id}>
                    <h4 className="pb-2 text-lg font-weight-bold">{n.title}</h4>
                    <p className="text-sm">{n.content}</p>
                  </div>
                  <p className="text-sm text-right col-md-2 col-lg-4">
                    {`${new Date(n.createdAt).toDateString()} ${new Date(
                      n.createdAt
                    ).toLocaleTimeString()}`}
                  </p>
                </div>
              ))
            )}
          </div>
          <Modal
            onOk={handleMessage}
            okText={"Save article"}
            cancelText="Discard"
            title="Write a message to participants"
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
          <Modal
            onOk={handlePublishArticle}
            okText={"Publish article"}
            cancelText="Discard"
            title="Compose a new article"
            visible={isWriteModalOpen}
            closable
            on
            onCancel={() => setIsWriteModalOpen(false)}
          >
            <Input
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
              value={article.title}
              size="large"
              placeholder="Title"
            />
            <div className="pt-3">
              <Input.TextArea
                onChange={(e) =>
                  setArticle({ ...article, content: e.target.value })
                }
                value={article.content}
                style={{ height: 200 }}
                placeholder="Content"
              />
            </div>
          </Modal>
        </Container>
      </div>
      <Footer />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, {})(LocationDetails);