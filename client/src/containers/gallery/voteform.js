import React, { useState } from "react";
import { Button, Form, Input, Rate } from "antd";
import { Row, Col } from "reactstrap";
import { inclusivityJudges, finalJudges } from "../../constants";

const VoteForm = ({
  createProjectVote,
  updateProjectVote,
  hideModal,
  curVote,
  getGallery,
  challenge_kind,
}) => {
  const [ loading, setLoading ] = useState(false)
  const onFinish = async (values) => {
    if (loading) return
    values.participant = curVote.participant;
    values.gallery = curVote.gallery;
    setLoading(true)
    if (curVote._id) {
      values._id = curVote._id;
      await updateProjectVote(values);
    } else {
      await createProjectVote(values);
    }
    await getGallery(curVote.gallery);
    setLoading(false)
    hideModal();
  };
  const judgeitems =
    challenge_kind === "inclusivity" ? inclusivityJudges : finalJudges;
  return (
    <Form
      name="create-challenge"
      onFinish={onFinish}
      initialValues={{ ...curVote }}
      className="vote-form"
    >
      {judgeitems.map((item, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <hr />}
          <p>
            <b>{item.title}:</b>
          </p>
          {item.items.map((child) => (
            <Row key={child.field}>
              <Col md={8} xs={12}>
                <span>{child.question}</span>
              </Col>
              <Col md={4} xs={12}>
                <Form.Item name={child.field}>
                  <Rate allowHalf />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </React.Fragment>
      ))}
      <p />
      <span>Comment</span>
      <Form.Item name="comment">
        <Input.TextArea rows={3} />
      </Form.Item>
      <div className="btn-form-group">
        <Button type="primary" htmlType="submit" className="mr-3">
          Submit
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            hideModal();
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default VoteForm;
