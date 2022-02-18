import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import { Header, Footer } from "../../components/template";

class Summary extends Component {
  render = () => {
    const { fieldData } = this.props;
    let summary = "";
    for (let field of fieldData) {
      if (field.field === "summary") summary = field.value;
    }

    return (
      <React.Fragment>
        <Header />
        <Container className="content summary">
          <h2 className="summary-title text-center mb-4">Summary</h2>
          <div className="summary-text p-3" style={{ fontSize: 18 }}>
            <div
              className="sun-editor-editable"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
          <div className="center mt-4">
            <Link className="hk_button summary" to="/org-profile">
              Create Profile
            </Link>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    fieldData: state.profile.fieldData,
  };
};
export default connect(mapStateToProps, {})(Summary);
