import React, { Component } from "react";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";

class Temporary extends Component {
  render = () => {
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="temporary-view">
            <h2 className="mb-5">Project Gallery</h2>
            <div className="temp-desc">
              We previously incorrectly stated that Gallery submissions would be viewable<br />
              from May 20th onward.<br />
              Instead, you can view your project submission any time in a "Preview Gallery"<br />
              mode from your Project Detail page, and the overall Gallery of projects will be<br />
              made publicly available after all projects have been submitted on Friday, May 22nd.<br />
              Note that you can edit your project details at any time by returning to your<br />
              project detail page and clicking the “Create Gallery” link again.
            </div>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

export default Temporary;
