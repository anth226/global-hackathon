import React from "react";
import { Row, Col } from "reactstrap";
import { Form, Input, Button } from "antd";

const EditorForm = ({
  createComment,
  updateComment,
  hideEditor,
  comment,
  projectId,
}) => {
  const onFinish = async (values) => {
    if (!values.content) return
    if (comment._id) {
      updateComment(comment._id, values.content);
    } else {
      createComment(projectId, values.content, comment.parent);
    }
  };

  return (
    <Form
      name="edit-comment"
      className="mt-3"
      onFinish={onFinish}
      initialValues={{ ...comment }}
    >
      <Row>
        <Col md={12}>
          <Form.Item name="content">
            <Input.TextArea placeholder="Comment" rows={2} />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex" style={{marginTop: "-20px"}} >
        <Button htmlType="submit" className="mr-2" type="primary">Submit</Button>
        <Button onClick={hideEditor}>Cancel</Button>
      </div>
    </Form>
  );
};

export default EditorForm;
