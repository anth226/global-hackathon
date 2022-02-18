import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Link } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import HelpSider from "./sider";

class HelpCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: this.props.match.params.category,
    };
  }

  setCategory = (category) => {
    this.setState({ category });
  };

  renderCategory = () => {
    const { helpdocs } = this.props;
    const category = this.state.category;
    const renderDocs = helpdocs.filter((hd) => hd.related === category);
    return (
      <React.Fragment>
        <h3>{category}</h3>
        <div className="empty-space" />
        {renderDocs.map((rd) => (
          <div className="mb-3" key={rd._id}>
            <Link to={`/help-article/${rd.related}/${rd._id}`}>
              <FileTextOutlined /> {rd.title}
            </Link>
          </div>
        ))}
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
                category={this.state.category}
                setCategory={this.setCategory}
              />
            </Col>
            <Col md={9}>
              <div className="help-article">{this.renderCategory()}</div>
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

export default connect(mapStateToProps, {})(HelpCategory);
