import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Modal, Input } from "antd";
import { FileDrop } from "react-file-drop";
import UploadIcon from "../../assets/icon/upload.png";
import { ModalSpinner } from "../../components/pages/spinner";
import { dropRegFile, verifyPassphrase } from "../../actions/auth";
import { keyForOwner } from "../../actions/blockchain";
import cryptoJs from "crypto-js";

const { Search } = Input;

class Identity extends Component {
  state = {
    fileReading: false,
    showConfModal: false,
    pdfData: {},
    verifying: false,
  };
  fileInputRef = React.createRef(null);

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
    const { keyForOwner, verifyPassphrase, user, onClose } = this.props;
    this.setState({ verifying: true });
    const verified = await verifyPassphrase(pdfData, passphrase);
    if (verified) {
      const keyRes = await keyForOwner(pdfData.integraid);
      let keyResult =
        keyRes.data && keyRes.data.length > 0 ? keyRes.data[0] : { Record: {} };
      const pubkey = keyResult.Record.keyValue;
      const newPrvKey = cryptoJs.AES.decrypt(
        pdfData.private_key,
        passphrase
      ).toString(cryptoJs.enc.Utf8);
      localStorage.setItem(
        "integra_key",
        JSON.stringify({
          public_key: pubkey,
          private_key: newPrvKey,
          user_id: user._id,
        })
      );
      onClose();
    }
    this.setState({
      showConfModal: false,
      verifying: false,
    });
  };

  onTargetClick = (e) => {
    this.fileInputRef.current.click();
  };

  render() {
    const { showConfModal, fileReading, verifying } = this.state;
    return (
      <React.Fragment>
        <div className="file-drop-modal">
          <FileDrop
            onDrop={this.handleDropFile}
            onTargetClick={this.onTargetClick}
          >
            <div className="invite-file-zone">
              <img src={UploadIcon} alt="" className="mb-4" />
              <span>Drag your GLH Private Key here</span>
            </div>
          </FileDrop>
          <input
            onChange={this.onSelectFile}
            ref={this.fileInputRef}
            type="file"
            className="hidden"
          />
        </div>
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
              enterButton={verifying ? "Confirming..." : "Confirm"}
              size="large"
              onSearch={this.onConfirm}
            />
          </Modal>
        )}
        <ModalSpinner visible={fileReading} />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user: state.user.profile,
  };
}

export default connect(mapStateToProps, {
  dropRegFile,
  verifyPassphrase,
  keyForOwner,
})(Identity);
