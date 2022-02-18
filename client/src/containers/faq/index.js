import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Collapse, Button, Skeleton } from "antd";
import { listFaq, createFaq, updateFaq, deleteFaq } from "../../actions/faq";
import EditFaq from "./edit_form";
import { Header, Footer } from "../../components/template";

const { Panel } = Collapse;

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

  hideFaqForm = () => {
    this.setState({ curFaq: {}, visible: false });
  };

  render() {
    const { faq, createFaq } = this.props;
    const { loading, visible, curFaq } = this.state;
    let aqs = [];
    for (let fq of faq.faqs) {
      if (fq.answer) aqs.push(fq);
    }

    return (
      <React.Fragment>
        <Header />
        <div className="container content">
          <Row>
            <Col md={12} className="mb-4" style={{textAlign: "center"}}>
              <h5 style={{color: "#006699"}}>Frequently Asked Questions</h5>
            </Col>
          </Row>
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && (
            <Collapse accordion className="mb-5">
              {aqs.map((fq) => (
                <Panel header={fq.question} key={fq.question}>
                  <div
                    className="sun-editor-editable"
                    dangerouslySetInnerHTML={{ __html: fq.answer }}
                  />
                </Panel>
              ))}
            </Collapse>
          )}
          {!visible && (
            <Button type="primary" onClick={this.onCreateFaq}>
              Suggest New Question
            </Button>
          )}
          {visible && (
            <EditFaq
              curFaq={curFaq}
              createFaq={createFaq}
              hideFaqForm={this.hideFaqForm}
            />
          )}
        </div>
        <Footer />
      </React.Fragment>
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
})(AdminFaq);
