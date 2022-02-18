import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Input, message } from "antd";
import { Header, Footer } from "../../components/template";
import { Link } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import history from "../../history";

const { Search } = Input;

export const useQuote = "Using the Site";
export const formulateQuote = "Formulating Challenges and Solutions";
export const knowledgeQuote = "Fourth Sector Knowledgebase";
export const toolsQuote = "Social Media and Communications Tools";
export const videoQuote = "Videos";

class Help extends Component {
  onSearch = (value) => {
    if (!value || value.length < 3) {
      message.warn("Search text should be more than 3 in length");
      return;
    }
    history.push(`/help-search/${value}`);
  };

  render() {
    const { helpdocs } = this.props;
    const popDocs = helpdocs.filter((hd) => hd.popular === true);
    const useDocs = helpdocs.filter((hd) => hd.related === useQuote);
    const formulateDocs = helpdocs.filter(
      (hd) => hd.related === formulateQuote
    );
    const knowledgeDocs = helpdocs.filter(
      (hd) => hd.related === knowledgeQuote
    );
    const toolsDocs = helpdocs.filter((hd) => hd.related === toolsQuote);
    const videoDocs = helpdocs.filter((hd) => hd.related === videoQuote);

    return (
      <React.Fragment>
        <Header />
        <div className="help-search-block">
          <Search
            size="large"
            placeholder="Search the knowledge base"
            onSearch={this.onSearch}
            enterButton
          />
        </div>
        <Container className="content help">
          <h3 className="mb-5" style={{ textAlign: "center" }}>
            Most Popular Articles
          </h3>
          <Row>
            {popDocs.map((pd) => (
              <Col className="mb-3 help-popular" md={6} key={pd._id}>
                <Link to={`/help-article/${pd.related}/${pd._id}`}>
                  <FileTextOutlined /> {pd.title}
                </Link>
              </Col>
            ))}
          </Row>
          <hr />
          <Row className="mt-5 mb-4">
            <Col md={6}>
              <div
                className="help-link-block"
                onClick={() => history.push(`/help-category/${useQuote}`)}
              >
                <h5>{useQuote}</h5>
                <Link to={`/help-category/${useQuote}`}>
                  {useDocs.length} articles
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="help-link-block"
                onClick={() => history.push(`/help-category/${formulateQuote}`)}
              >
                <h5>{formulateQuote}</h5>
                <Link to={`/help-category/${formulateQuote}`}>
                  {formulateDocs.length} articles
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="help-link-block"
                onClick={() => history.push(`/help-category/${knowledgeQuote}`)}
              >
                <h5>{knowledgeQuote}</h5>
                <Link to={`/help-category/${knowledgeQuote}`}>
                  {knowledgeDocs.length} articles
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="help-link-block"
                onClick={() => history.push(`/help-category/${toolsQuote}`)}
              >
                <h5>{toolsQuote}</h5>
                <Link to={`/help-category/${toolsQuote}`}>
                  {toolsDocs.length} articles
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <div
                className="help-link-block"
                onClick={() => history.push(`/help-category/${videoQuote}`)}
              >
                <h5>{videoQuote}</h5>
                <Link to={`/help-category/${videoQuote}`}>
                  {videoDocs.length} articles
                </Link>
              </div>
            </Col>
          </Row>
          <p className="help-footer">
            © Global Legal Hackathon 2022
          </p>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { helpdocs: state.helpdoc.helpdocs };
}

export default connect(mapStateToProps, {})(Help);
