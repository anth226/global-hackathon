import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { message, Modal, Input, Row, Col } from "antd";
import { FileDrop } from "react-file-drop";
import { Link } from "react-router-dom";
import { Header } from "../../components/template";
import UploadIcon from "../../assets/icon/upload.png";
import { ModalSpinner } from "../../components/pages/spinner";
import {
  dropRegFile,
  loginWithIdentity,
  verifyPassphrase,
} from "../../actions/auth";
import history from "../../history";
import HomeBoard from "../home/homeboard";

const { Search } = Input;

class Identity extends Component {
  state = {
    fileReading: false,
    showConfModal: false,
    pdfData: {},
  };
  fileInputRef = React.createRef(null);

  componentDidMount = () => {
    const { authenticated, user } = this.props;
    if (authenticated && user.profile) {
      history.push("/dashboard");
    }
  };

  handleDropFile = async (files, e) => {
    const { dropRegFile } = this.props;
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true });
    const res = await dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    this.setState({
      fileReading: false,
      showConfModal: true,
      pdfData: res.data.result,
    });
  };

  onSelectFile = async (e) => {
    const { dropRegFile } = this.props;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true });
    const res = await dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    this.setState({
      fileReading: false,
      showConfModal: true,
      pdfData: res.data.result,
    });
  };

  onConfirm = async (passphrase) => {
    const { pdfData } = this.state;
    const { loginWithIdentity, verifyPassphrase } = this.props;
    const verified = await verifyPassphrase(pdfData, passphrase);
    if (verified) {
      await loginWithIdentity(pdfData);
    }
    this.setState({
      showConfModal: false,
    });
  };

  onTargetClick = (e) => {
    this.fileInputRef.current.click();
  };

  render() {
    const { showConfModal } = this.state;
    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <Container>
            <h1>
              Log into existing <span className="green-grad">#GLH2022</span>{" "}
              account
            </h1>
            <Row gutter={30} className="mt-5">
              <Col lg={15} md={12} sm={24} xs={24} className="mb-4">
                <div className="item-block">
                  <FileDrop
                    onDrop={this.handleDropFile}
                    onTargetClick={this.onTargetClick}
                  >
                    <div className="invite-file-zone">
                      <img src={UploadIcon} alt="" className="mb-4" />
                      <span>Drag your GLH Private Key here</span>
                    </div>
                  </FileDrop>
                  <div className="divide-line">
                    <hr />
                    <p>OR</p>
                  </div>
                  <Link to="/login" className="glh-btn-blue-wide">
                    Login with Email
                  </Link>
                  <input
                    onChange={this.onSelectFile}
                    ref={this.fileInputRef}
                    type="file"
                    className="hidden"
                  />
                </div>
              </Col>
              <Col lg={9} md={12} sm={24} xs={24} className="mb-4">
                <div className="green-block">
                  <h5>Don't have a GLH Private Key yet?</h5>
                  <div className="register-box">
                    <Link
                      className="glh-btn-default-wide"
                      to="/identity-register"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <ModalSpinner visible={this.state.fileReading} />
          {showConfModal && (
            <Modal
              title="Please confirm the passphrase for you GLH Private Key"
              visible={showConfModal}
              width={800}
              footer={false}
              centered
            >
              <Search
                placeholder="Passphrase"
                enterButton="Confirm"
                size="large"
                onSearch={this.onConfirm}
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
    fields: state.profile,
    user: state.user.profile,
    loc: state.loc,
  };
}

export default connect(mapStateToProps, {
  dropRegFile,
  loginWithIdentity,
  verifyPassphrase,
})(Identity);
