import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { readNotification } from "../../actions/notification";
import { Header, Footer } from "../../components/template";
import moment from "moment";

class Notification extends Component {
  render() {
    const notifications = this.props.notification.notifications;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Row>
            <Col>
              <h5 className="mb-4">Notifications</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              {notifications.map((item) => {
                return this.renderNotificationItem(item);
              })}
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }

  renderSender = (item) => {
    if (!item.author) return null;
    const profile = item.author.profile || {};
    let name = `${profile.first_name} ${profile.last_name}`;
    return (
      <div className="notif-author">
        <img src={profile.photo} alt="" />
        <div className="notif-name">
          <div className="name">{name}</div>
          <span>{moment(item.createdAt).format("MM/DD/YY  ha")}</span>
        </div>
      </div>
    );
  };

  renderNotificationItem = (item) => (
    <div
      className={`notif-item ${item.unread ? "unread-notif" : ""}`}
      key={item._id}
      onClick={() => this.props.readNotification(item)}
    >
      {this.renderSender(item)}
      <div className="notif-body">
        <div className="title">{item.title}</div>
        <div
          className="sun-editor-editable"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { notification: state.notification };
}

export default connect(mapStateToProps, {
  readNotification,
})(Notification);
