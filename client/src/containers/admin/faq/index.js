import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Collapse, Button, Skeleton, Popconfirm } from "antd";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import { listFaq, createFaq, updateFaq, deleteFaq, bulkUpdateFaq } from "../../../actions/faq";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import EditFaq from "./edit_form";

const { Panel } = Collapse;

const SortableItem = sortableElement(({ children }) => <div>{children}</div>);

const SortableContainer = sortableContainer(({ children }) => {
  return <div className="mb-5">{children}</div>;
});

class AdminFaq extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      curFaq: {},
      visible: false,
    };
  }

  componentDidMount = async () => {
    const { listFaq, faq } = this.props;
    if (!faq.faqs || faq.faqs.length === 0) {
      this.setLoading(true);
      await listFaq();
      this.setLoading(false);
    }
  };

  setLoading = (loading) => {
    this.setState({ loading });
  };

  onCreateFaq = () => {
    this.setState({ curFaq: {}, visible: true });
  };

  onUpdateFaq = (fq) => {
    this.setState({ curFaq: fq, visible: true });
  };

  onDeleteFaq = (fq) => {
    this.props.deleteFaq(fq._id);
  };

  hideFaqForm = () => {
    this.setState({ curFaq: {}, visible: false });
  };

  genExtra = (fq) => (
    <React.Fragment>
      <Button
        type="link"
        title="update"
        className="btn-no-padding"
        onClick={(event) => {
          event.stopPropagation();
          this.onUpdateFaq(fq);
        }}
      >
        <FormOutlined />
      </Button>
      <Popconfirm
        title="Are you sure delete this item?"
        onConfirm={() => this.onDeleteFaq(fq)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          className="btn-no-padding"
          type="link"
          style={{ color: "red" }}
          title="delete"
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </React.Fragment>
  );

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { faq, bulkUpdateFaq } = this.props;
    if (oldIndex === newIndex) return
    let aqs = [], uqs = [];
    for (let fq of faq.faqs) {
      if (fq.answer) aqs.push(fq);
      else uqs.push(fq);
    }
    let newAqs = arrayMove(aqs, oldIndex, newIndex)
    for (let i = 0; i < newAqs.length; i++) {
      newAqs[i].order = i
    }
    bulkUpdateFaq([...newAqs, ...uqs])
  };

  render() {
    const { faq, createFaq, updateFaq } = this.props;
    const { loading, visible, curFaq } = this.state;
    let aqs = [],
      uqs = [];
    for (let fq of faq.faqs) {
      if (fq.answer) aqs.push(fq);
      else uqs.push(fq);
    }

    return (
      <div className="container">
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        <Row>
          <Col className="flex">
            <h5 className="mr-auto mb-5">FAQ</h5>
          </Col>
        </Row>
        {!loading && (
          <SortableContainer onSortEnd={this.onSortEnd}>
            {aqs.map((fq, i) => (
              <SortableItem key={fq.question} index={i}>
                <Collapse accordion>
                  <Panel
                    header={fq.question}
                    key={fq.question}
                    extra={this.genExtra(fq)}
                  >
                    <div
                      className="sun-editor-editable"
                      dangerouslySetInnerHTML={{ __html: fq.answer }}
                    />
                  </Panel>
                </Collapse>
              </SortableItem>
            ))}
          </SortableContainer>
        )}
        {uqs.length > 0 && (
          <React.Fragment>
            <span>Unanswered questions</span>
            <Collapse accordion className="mb-5">
              {uqs.map((fq) => (
                <Panel
                  header={fq.question}
                  key={fq.question}
                  extra={this.genExtra(fq)}
                >
                  <div
                    className="sun-editor-editable"
                    dangerouslySetInnerHTML={{ __html: fq.answer }}
                  />
                </Panel>
              ))}
            </Collapse>
          </React.Fragment>
        )}
        {!visible && (
          <Button type="primary" onClick={this.onCreateFaq}>
            Add New
          </Button>
        )}
        {visible && (
          <EditFaq
            curFaq={curFaq}
            createFaq={createFaq}
            updateFaq={updateFaq}
            hideFaqForm={this.hideFaqForm}
            curLength={aqs.length}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { faq: state.faq };
}

export default connect(mapStateToProps, {
  listFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  bulkUpdateFaq
})(AdminFaq);
