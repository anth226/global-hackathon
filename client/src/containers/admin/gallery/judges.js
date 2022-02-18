import React from "react";
import { Row, Col } from "reactstrap";
import { Comment, Avatar, Tooltip, Slider } from "antd";
import UserAvatar from "../../../assets/img/user-avatar.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { inclusivityJudges, finalJudges } from "../../../constants";

class ReviewCard extends React.Component {
  getAverageRate = (pvs, key) => {
    if (!pvs || pvs.length === 0) return 0;
    let sum = 0;
    let num = 0;
    for (let pv of pvs) {
      sum += pv[key] || 0;
      num++;
    }
    return (20 * sum) / num;
  };

  renderComment = (gallery) => {
    const { isadmin } = this.props;
    if (!gallery.pvs || gallery.pvs.length === 0) return null;
    let comments = [];
    for (let comm of gallery.pvs) {
      if (comm.comment) comments.push(comm);
    }
    if (comments.length === 0) return null;

    return (
      <div className="slider-comment">
        {comments.map((pv, i) => (
          <Comment
            key={i}
            author={
              <span>
                {pv.participant && isadmin
                  ? `${pv.participant.profile.first_name} ${pv.participant.profile.last_name}`
                  : "Project Comment"}
              </span>
            }
            avatar={
              <span>
                {pv.participant && isadmin && (
                  <Link to={`/participant/${pv.participant._id}`}>
                    <Avatar
                      src={pv.participant.profile.photo || UserAvatar}
                      alt="logo"
                    />
                  </Link>
                )}
                {!isadmin && <Avatar src={UserAvatar} alt="logo" />}
              </span>
            }
            content={<p>{pv.comment}</p>}
            datetime={
              <Tooltip
                title={moment(pv.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              >
                <span>{moment(pv.createdAt).fromNow()}</span>
              </Tooltip>
            }
          />
        ))}
      </div>
    );
  };

  getMarksRate = (rate) => {
    return parseInt(5 * rate) / 100;
  };

  getTotalAverage = (judges, pvs) => {
    let sum = 0,
      num = 0;
    for (let judge of judges) {
      for (let child of judge.items) {
        sum += this.getAverageRate(pvs, child.field);
        num++;
      }
    }
    return sum / num;
  };

  render() {
    const { gallery } = this.props;
    const judgeitems =
      gallery.challenge &&
      gallery.challenge.challenge_name.toLowerCase().includes("inclusivity")
        ? inclusivityJudges
        : finalJudges;
    return (
      <div className="review-card">
        <div className="review-title">
          <h4 className="mb-2">
            <b>{gallery.name}</b>
          </h4>
        </div>
        <Row>
          <Col className="slider-block">
            {judgeitems.map((item) => (
              <React.Fragment key={item.title}>
                <p className="mt-4">
                  <b>{item.title}:</b>
                </p>
                {item.items.map((child) => (
                  <React.Fragment key={child.field}>
                    <div className="slider-title">{child.question}</div>
                    <Slider
                      max={100}
                      value={this.getAverageRate(gallery.pvs, child.field)}
                      className="mb-4"
                      marks={{
                        100: this.getMarksRate(
                          this.getAverageRate(gallery.pvs, child.field)
                        ),
                      }}
                    />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <p className="mt-4">
              <b>Total:</b>
            </p>
            <Slider
              max={100}
              value={this.getTotalAverage(judgeitems, gallery.pvs)}
              className="mb-4"
              marks={{
                100: {
                  style: {
                    color: "#f50",
                  },
                  label: (
                    <strong>
                      {this.getMarksRate(
                        this.getTotalAverage(judgeitems, gallery.pvs)
                      )}
                    </strong>
                  ),
                },
              }}
            />
            {this.renderComment(gallery)}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReviewCard;
