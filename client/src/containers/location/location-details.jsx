import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { BigUpload, Footer, Header } from "../../components/template";
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
  const [sponsors, setSponsors] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);

  const [message, setMessage] = useState(``);

  const [article, setArticle] = useState({
    title: "",
    content: "",
    locationId: id,
  });

  const [sponsor, setSponsor] = useState({
    name: "",
    link: "",
    imageUrl: "",
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

    client
      .get(`${process.env.REACT_APP_API_HOST}/sponsors/location/${id}`)
      .then((res) => setSponsors(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleMessage = async (e) => {
    e.preventDefault();

    client
      .post(`${process.env.REACT_APP_API_HOST}/location/${id}/message`, {
        message,
      })
      .then((res) => {
        notification.success("Messages sent successfully");
        setOpenModal("");
      })
      .catch((err) => console.error(err));
  };

  const handlePublishArticle = async (e) => {
    e.preventDefault();

    client
      .post(`${process.env.REACT_APP_API_HOST}/news`, article)
      .then((res) => {
        setNews([res.data.news, ...news]);
        notification.success("Messages sent successfully");
        setOpenModal("");
      })
      .catch((err) => console.error(err));
  };

  const handleNewSponsor = async (e) => {
    e.preventDefault();

    client
      .post(`${process.env.REACT_APP_API_HOST}/sponsors`, sponsor)
      .then((res) => {
        setSponsors([res.data, ...sponsors]);
        notification.success("Sponsor saved successfully");
        setOpenModal("");
      })
      .catch((err) => {
        console.error(err);
        notification.error("Failed registering a sponsor");
      });
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
                  onClick={() => setOpenModal("message")}
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
                    onClick={(e) => setOpenModal("article")}
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
                <div className="row py-3" key={n._id}>
                  <div className="col-12 col-md-10 col-lg-8">
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
          <section className="pb-5">
            <div className="d-flex justify-content-between pb-5">
              <h2 className="text-primary font-weight-bold">Sponsors</h2>
              {user?.profile?.location_role === "Admin" && (
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => setOpenModal("sponsor")}
                  >
                    New sponsor
                  </button>
                </div>
              )}
            </div>
            <div className="d-flex">
              {sponsors.map((sp) => (
                <div key={sp._id} className="p-2">
                  <a
                    className="d-block rounded border p-3"
                    href={sp.link}
                    target="_blank"
                  >
                    <img className="d-block w-100" src={sp.imageUrl} />
                    {sp.name}
                  </a>
                </div>
              ))}
            </div>
          </section>
          <Modal
            onOk={handleMessage}
            okText={"Save article"}
            cancelText="Discard"
            title="Write a message to participants"
            visible={openModal === "message"}
            closable
            on
            onCancel={() => setOpenModal("")}
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
            visible={openModal === "article"}
            closable
            on
            onCancel={() => setOpenModal("")}
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
          <Modal
            onOk={handleNewSponsor}
            okText={"Save sponsor"}
            cancelText="Discard"
            title="New sponsor"
            visible={openModal === "sponsor"}
            closable
            on
            onCancel={() => setOpenModal("")}
          >
            <Input
              onChange={(e) => setSponsor({ ...sponsor, name: e.target.value })}
              size="large"
              placeholder="Name"
            />
            <div className="py-3">
              <Input
                onChange={(e) =>
                  setSponsor({ ...sponsor, link: e.target.value })
                }
                size="large"
                placeholder="Website or link"
              />
            </div>
            <BigUpload
              setAvatar={(url) =>
                setSponsor((prev) => ({ ...prev, imageUrl: url }))
              }
              imageUrl={sponsor.imageUrl}
              subject="sponsor"
            />
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
