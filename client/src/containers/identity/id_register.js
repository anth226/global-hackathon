import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import {
  Loading3QuartersOutlined,
  LeftOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { Header } from "../../components/template";
import { saveAs } from "file-saver";
import { v4 } from "uuid";
import {
  createIntegraWallet,
  sendEmailIdentity,
  setShowInstruct,
} from "../../actions/auth";
import { setInviteLocation } from "../../actions/location";
import HomeBoard from "../home/homeboard";
import history from "../../history";
import { CreateWalletForm, EmailForm } from "./forms";

class Register extends Component {
  state = {
    integraId: v4(),
    sendEmail: "",
    showConfirm: false,
    walletValues: {},
    loading: false,
    showReadMore: true,
    showEmailModal: false,
    popupStep: 0,
  };

  componentDidMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const inv_id = params.get("inv_id");
    this.props.setInviteLocation(inv_id);
  };

  onHideShowConfirm = () => {
    this.setState({ showConfirm: false });
  };

  onGenerageWallet = async (values) => {
    this.setState({ loading: true });
    await this.props.createIntegraWallet(values);
    saveAs(this.props.pdfResult, `GLH_Key_${this.state.integraId}.pdf`);
    this.setState({ loading: false, showConfirm: false, showEmailModal: true });
  };

  onSubmitForm = (values) => {
    this.setState({ walletValues: values, showConfirm: true });
  };

  onSendEmail = async (email) => {
    const { pdfResult, sendEmailIdentity } = this.props;
    await sendEmailIdentity(
      email,
      pdfResult,
      `GLH_Key_${this.state.integraId}.pdf`
    );
    this.onGoNext();
  };

  onGoNext = () => {
    history.push("/register");
  };

  onToggleReadMore = () => {
    this.setState({ showReadMore: !this.state.showReadMore });
  };

  onGoNextReadMore = () => {
    const { popupStep } = this.state;
    if (popupStep === 2) {
      this.setState({ showReadMore: false, popupStep: 0 });
      return;
    }
    this.setState({ popupStep: popupStep + 1 });
  };

  renderConfirmModal = () => {
    const { walletValues, loading } = this.state;
    return (
      <div className="confirm-modal">
        <p className="warning">
          Warning: if lost, passphrase will not be recoverable.
        </p>
        <p>
          Please write it down before you continue, as you will need it log in.
        </p>
        <div className="vbtn-group">
          <button
            className="blue-btn"
            onClick={() => this.onGenerageWallet(walletValues)}
          >
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
            Download GLH Private Key​
          </button>
        </div>
      </div>
    );
  };

  renderReadMore = () => {
    const { popupStep } = this.state;

    return (
      <div className="read-more-popup">
        {popupStep === 0 && (
          <React.Fragment>
            <div className="title">
              Welcome to the new GLH technology platform!​
            </div>
            <p>
              For the first time, all participants, teams, hosts, mentors, and
              judges will have a common platform on which to communicate,
              collaborate, post projects, judge and showcase winners. We built
              this platform to ensure that no matter the different COVID rules
              and regulations around the world, all participants and hosts will
              be able to take part in the #GLH2022 weekend – March 25-27.
            </p>
            <p>Some of the highlights:</p>
            <ol>
              <li>
                Host cities can seamlessly support both in-person and virtual
                participation
              </li>
              <li>
                Participants, teams, and hosts can message each other from
                within the application
              </li>
              <li>
                Team will post their projects in a public gallery, giving them
                the opportunity for press and publicity
              </li>
              <li>Project judging will be more consistent around the world</li>
              <li>
                When participants register, they will be issued a highly secure
                GLH Private Key, utilizing blockchain technology, that can be
                used for both login and encrypted messaging.
              </li>
            </ol>
            <button className="btn-blue" onClick={this.onGoNextReadMore}>
              Next – Registration Instructions
            </button>
          </React.Fragment>
        )}
        {popupStep === 1 && (
          <React.Fragment>
            <div className="title">
              New for #GLH2022 – GLH Private Key for secure login and encrypted
              messaging​
            </div>
            <p>
              The Global Legal Hackathon is excited to use blockchain technology
              to secure #GLH2022. This will allow you to keep your login
              credentials private, and enable encrypted communications with
              other participants in the event.​
            </p>
            <p>
              <b>How to get your free GLH Private Key:​</b>
            </p>
            <div className="step-box">
              <div>
                <div className="head-tip">Step 1:</div>
              </div>
              <p>
                Create a passphrase, which is like a password (but more private)
                and encrypted into the GLH key itself. If lost, there is no way
                to recover the passphrase, as it is not stored anywhere.
              </p>
            </div>
            <div className="step-box">
              <div>
                <div className="head-tip">Step 2:</div>
              </div>
              <p>Download your GLH Private Key.</p>
            </div>
            <div className="step-box">
              <div>
                <div className="head-tip">Step 3:</div>
              </div>
              <p>Use your new GLH Private Key to register for #GLH2022</p>
            </div>
            <button className="btn-blue" onClick={this.onGoNextReadMore}>
              Next – How to create a passphrase
            </button>
          </React.Fragment>
        )}
        {popupStep === 2 && (
          <React.Fragment>
            <div className="title">About your Passphrase</div>
            <p>
              Your new GLH Private Key is an encrypted credential that is stored
              on your computer. Your own passphrase will then be used to decrypt
              the GLH Private Key. Only you will know this passphrase. Unlike
              cloud software, there is no central authority or company keeping a
              record of your passphrase.​
            </p>
            <div className="mt-5" />
            <p className="underline">
              <b>
                Do not lose or share your passphrase, as it cannot be changed or
                recovered.​
              </b>
            </p>
            <p>
              Once your passphrase is set, a copy of your new encrypted GLH
              Private Key will be downloaded to your computer. You can also send
              a copy of it to your email for easy access. The combination of
              your GLH Private Key file and passphrase creates a private
              blockchain-based login to the GLH platform that doesn’t rely on a
              cloud database.​
            </p>
            <button className="btn-blue" onClick={this.onGoNextReadMore}>
              I understand that my passphrase cannot be recovered if lost
            </button>
          </React.Fragment>
        )}
      </div>
    );
  };

  render() {
    const { integraId, showConfirm, showReadMore, showEmailModal } = this.state;

    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <Container>
            <Link to="/identity" className="back-link">
              <LeftOutlined className="mt-2" /> Back
            </Link>
            <div className="center">
              <h1>Create Your Passphrase</h1>
              <p className="mt-4 description">
                Blockchain technology enables us to create more secure accounts
                for users of GLH 2022, Logins with email are still supported.{" "}
                <span className="read-more" onClick={this.onToggleReadMore}>
                  Read more
                </span>
              </p>
              <Link
                to="#"
                onClick={() => this.props.setShowInstruct(true)}
                className="video-btn"
              >
                <PlayCircleFilled /> Play video instructions
              </Link>
            </div>
            <div className="create-block">
              <div className="main-block">
                <h5 className="center">
                  This is not stored on a database or the blockchain, so don’t
                  lose it!
                </h5>
              </div>
              <div className="form-block">
                <div className="gray-board">
                  <CreateWalletForm
                    onSubmit={this.onSubmitForm}
                    invId={integraId}
                  />
                </div>
              </div>
            </div>
            <p className="email-contact">
              Need help? Ask{" "}
              <a href="mailto:GLH2022@globallegalhackathon.com">
                GLH2022@globallegalhackathon.com
              </a>
            </p>
          </Container>
          {showConfirm && (
            <Modal
              title="Download your GLH Private Key​"
              visible={showConfirm}
              onCancel={this.onHideShowConfirm}
              width={550}
              footer={false}
              centered
            >
              {this.renderConfirmModal()}
            </Modal>
          )}
          {showReadMore && (
            <Modal
              visible={showReadMore}
              width={800}
              footer={false}
              className="readmore-modal"
              onCancel={this.onToggleReadMore}
            >
              {this.renderReadMore()}
            </Modal>
          )}
          {showEmailModal && (
            <Modal
              title="Registration"
              visible={showEmailModal}
              onCancel={this.onHideEmailModal}
              width={500}
              footer={false}
              centered
            >
              <EmailForm
                onSubmit={this.onSendEmail}
                onContinue={this.onGoNext}
              />
            </Modal>
          )}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    pdfResult: state.auth.pdfResult,
    fields: state.profile,
    loc: state.loc,
  };
}

export default connect(mapStateToProps, {
  createIntegraWallet,
  sendEmailIdentity,
  setInviteLocation,
  setShowInstruct,
})(Register);
