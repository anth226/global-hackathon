import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import HelpSider from "./sider";

class HelpArticle extends Component {
  renderArticle = () => {
    const { helpdocs, match } = this.props;
    const articleId = match.params.articleId;
    const article = helpdocs.filter((hd) => hd._id === articleId);
    if (article.length === 0) return <h3>No content for this document</h3>;
    return (
      <React.Fragment>
        <h3>{article[0].title}</h3>
        <div className="empty-space" />
        <div
          className="sun-editor-editable"
          dangerouslySetInnerHTML={{ __html: article[0].content }}
        />
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <Container className="content help">
          <Row>
            <Col md={3}>
              <HelpSider
                category={this.props.match.params.category}
                setCategory={() => {}}
              />
            </Col>
            <Col md={9}>
              <div className="help-article">{this.renderArticle()}</div>
            </Col>
          </Row>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { helpdocs: state.helpdoc.helpdocs };
}

export default connect(mapStateToProps, {})(HelpArticle);
