import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Footer } from "../../components/template";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Container } from "reactstrap";
import { Modal, Spin } from "antd";
import { unsubscribe } from "../../actions/glhcontact";
import history from "../../history";
import UnSbImg from "../../assets/img/unsubscribe.png";

class HomePage extends Component {
  state = {
    email: "",
    showModal: true,
    loading: false,
  };

  componentDidMount = async () => {
    const email = this.props.match.params.email;
    this.setState({ email });
  };

  onUnsubscribe = async () => {
    this.setState({ loading: true });
    await this.props.unsubscribe(this.state.email);
    this.setState({ loading: false, showModal: false });
  };

  onClickNo = () => {
    this.setState({ showModal: false });
    history.push("/");
  };

  render() {
    const { email, showModal, loading } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="unsub-box">
            <img src={UnSbImg} className="unsb-img" alt="" />
            <p className="sub-title">We're Sad To See You Go!</p>
            <span className="sub-desc">
              you have successfully unsubscribed, you will no longer receive
              this type of emails from #GLH2022
            </span>
          </div>
        </Container>
        {showModal && (
          <Modal
            visible={showModal}
            width={700}
            centered
            footer={false}
            closable={false}
            className="unsubscribe_modal"
          >
            <h3>
              <b>Do you really want to unsubscribe?</b>
            </h3>
            <p className="mt-5" style={{ textAlign: "center", color: "#111" }}>
              You are currently subscribed to <b>#GLH2022</b> list with the
              following address: <b>{email}</b>
            </p>
            <div className="btn-group">
              <button className="blue-btn" onClick={this.onUnsubscribe}>
                {loading && (
                  <Spin
                    indicator={
                      <Loading3QuartersOutlined
                        style={{ fontSize: 18 }}
                        spin
                        className="mr-2"
                      />
                    }
                  />
                )}
                {loading ? "Unsubscribing..." : "Yes"}
              </button>
              <button className="blue-btn" onClick={this.onClickNo}>
                No
              </button>
            </div>
          </Modal>
        )}
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, {
  unsubscribe,
})(HomePage);
