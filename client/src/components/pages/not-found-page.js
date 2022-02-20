import { Result } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Footer from "../template/footer";
import Header from "../template/header";

class NotFoundPage extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="content">
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Link to="/">Back Home</Link>}
          />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}
export default NotFoundPage;
