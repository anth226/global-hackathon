import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Header } from "../../components/template";
import { ModalSpinner } from "../../components/pages/spinner";
import HomeBoard from "../home/homeboard";
import { getOneFieldData } from "../../utils/helper";
import { listFieldData } from "../../actions/profile";

class Privacy extends Component {
  state = {
    loading: false,
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.props.listFieldData();
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    const privacy = getOneFieldData(this.props.fieldData, "privacy");
    return (
      <React.Fragment>
        <Header />
        <HomeBoard empty={true} />
        <div className="identity-container">
          <Container>
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: privacy }}
            />
          </Container>
          <ModalSpinner visible={loading} />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, { listFieldData })(Privacy);
