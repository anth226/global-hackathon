import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { Container } from "reactstrap";
import { Header } from "../../components/template";
import { ModalSpinner } from "../../components/pages/spinner";
import HomeBoard from "../home/homeboard";
import { getOneFieldData } from "../../utils/helper";
import { listFieldData } from "../../actions/profile";
import { createRule } from "../../actions/rule";
import history from "../../history";

class Rules extends Component {
  state = {
    loading: false,
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.props.listFieldData();
    this.setState({ loading: false });
  };

  goToDashboard = () => {
    history.push("/dashboard");
  };

  agree = async () => {
    const { createRule, user } = this.props;
    await createRule(user._id);
    this.goToDashboard();
  };

  render() {
    const { loading } = this.state;
    const rules = getOneFieldData(this.props.fieldData, "rules");
    return (
      <React.Fragment>
        <Header />
        <HomeBoard empty={true} />
        <div className="identity-container">
          <Container>
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: rules }} />
            <div className="agree-btns">
              <Button type="default" onClick={this.goToDashboard}>
                Disagree
              </Button>
              <Button type="primary" onClick={this.agree}>
                Agree
              </Button>
            </div>
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
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, { listFieldData, createRule })(Rules);
