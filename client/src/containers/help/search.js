import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Header, Footer } from "../../components/template";
import { Link } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import HelpSider from "./sider";

class HelpSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTxt: this.props.match.params.search,
    };
  }

  setSearch = (search) => {
    this.setState({ searchTxt: search });
  };

  extractContent(s, space) {
    var span = document.createElement("span");
    span.innerHTML = s;
    if (space) {
      var children = span.querySelectorAll("*");
      for (var i = 0; i < children.length; i++) {
        if (children[i].textContent) children[i].textContent += " ";
        else children[i].innerText += " ";
      }
    }
    return [span.textContent || span.innerText].toString().replace(/ +/g, " ");
  }

  getSearchedDocs = () => {
    const { helpdocs } = this.props;
    const { searchTxt } = this.state;
    const sds = helpdocs.filter((hd) => {
      if (hd.title.includes(searchTxt)) return true;
      if (this.extractContent(hd.content, true).includes(searchTxt))
        return true;
      return false;
    });
    return sds;
  };

  renderDocs = () => {
    const docs = this.getSearchedDocs();
    if (docs.length === 0) {
      return <h4>No document with that search topic</h4>;
    }
    return (
      <React.Fragment>
        <h3>Search results for {this.state.searchTxt}</h3>
        <div className="empty-space" />
        {docs.map((rd) => (
          <div className="mb-3" key={rd._id}>
            <Link to={`/help-article/${rd.related}/${rd._id}`}>
              <FileTextOutlined /> {rd.title}
            </Link>
            <p>{this.extractContent(rd.content, true).substring(0, 170)}</p>
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
                category={""}
                setCategory={() => {}}
                searchTxt={this.state.searchTxt}
                setSearch={this.setSearch}
              />
            </Col>
            <Col md={9}>
              <div className="help-article">{this.renderDocs()}</div>
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

export default connect(mapStateToProps, {})(HelpSearch);
