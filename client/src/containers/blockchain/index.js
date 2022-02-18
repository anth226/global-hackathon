import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { message, Descriptions, Tabs } from "antd";
import { Header, Footer } from "../../components/template";
import { FileDrop } from "react-file-drop";
import { dropRegFile } from "../../actions/auth";
import { keyForOwner } from "../../actions/blockchain";
import UploadIcon from "../../assets/icon/upload.png";
import { ModalSpinner } from "../../components/pages/spinner";
import { Link } from "react-router-dom";
import moment from "moment";

const { TabPane } = Tabs;

class Blockchain extends Component {
  state = {
    step: 0,
    fileReading: false,
    pdfData: {},
    result: { Record: {} },
    showmore: false,
    showPubMore: false,
  };
  fileInputRef = React.createRef(null);

  handleDropFile = async (files, e) => {
    if (!files || files.length === 0) return;
    this.getBlockchainData(files[0]);
  };

  onSelectFile = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    this.getBlockchainData(files[0]);
  };

  getBlockchainData = async (file) => {
    const { dropRegFile, keyForOwner } = this.props;
    this.setState({ fileReading: true });
    const fileRes = await dropRegFile(file);
    if (!fileRes.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    const keyRes = await keyForOwner(fileRes.data.result.integraid);
    let keyResult =
      keyRes.data && keyRes.data.length > 0 ? keyRes.data[0] : { Record: {} };
    this.setState({
      pdfData: fileRes.data.result,
      fileReading: false,
      step: 1,
      result: keyResult,
    });
  };

  onTargetClick = (e) => {
    this.fileInputRef.current.click();
  };

  onToggleShowMore = () => {
    this.setState({ showmore: !this.state.showmore });
  };

  onToggleShowPubMore = () => {
    this.setState({ showPubMore: !this.state.showPubMore });
  };

  renderFileZone = () => {
    return (
      <div className="blockchain-card">
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
    );
  };

  renderResult = () => {
    const { pdfData, showmore } = this.state;
    return (
      <div className="blockchain-result">
        <p className="p-3">
          The information on this tab is pulled directly from the GLH Private
          Key PDF file that was dropped onto this page. Some items to note below
          are the IntegraId, and PrivateKey. The IntegraId is the blockchain
          identifier that points to the corresponding public key on the
          IntegraLedger blockchain. On the next tab please note that the
          IntegraId will be the lookup field for the record. This is your
          identity on the platform. The PrivateKey value is encrypted, using the
          AES encryption algorithm, in this document so even if it was lost it
          would be useless unless the passphrase was known as well.
        </p>
        <Descriptions column={{ lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="IntegraID">
            {pdfData.integraid}
          </Descriptions.Item>
          <Descriptions.Item label="IntegraCartridgeType">
            {pdfData.integra_cartridge_type}
          </Descriptions.Item>
          <Descriptions.Item label="FormJSON">
            {pdfData.formjson}
          </Descriptions.Item>
          <Descriptions.Item label="InfoJSON">
            {pdfData.infojson}
          </Descriptions.Item>
          <Descriptions.Item label="ModDate">
            {pdfData.modDate}
          </Descriptions.Item>
          <Descriptions.Item label="PrivateKey">
            <div className={showmore ? "" : "opted"}>{pdfData.private_key}</div>
            <Link to="#" onClick={this.onToggleShowMore}>
              show {showmore ? "less" : "more"}
            </Link>
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  renderPubkey = () => {
    const { result, pdfData, showPubMore } = this.state;
    return (
      <div className="blockchain-result">
        <p className="p-3">
          The information on this tab is pulled from the Integra Ledger
          Blockchain using the IntegraId (from the previous tab) to look up the
          public key to which it belongs. The public key can be used to encrypt
          documents, messages, conversations, and almost any other type of
          information. The only way to decrypt the information is to have the
          GLH Private Key PDF and the passphrase that encrypted the private key.
          The item to note on this tab is the TransactionId, this will be used
          on the next tab to pull up the exact transaction where this was
          written to the blockchain.
        </p>
        <Descriptions column={{ lg: 1, md: 1, sm: 1, xs: 1 }} bordered>
          <Descriptions.Item label="IntegraID">
            {pdfData.integraid}
          </Descriptions.Item>
          <Descriptions.Item label="TransactionID">
            {result.Record.transactionId}
          </Descriptions.Item>
          <Descriptions.Item label="$Class">
            {result.Record["$class"]}
          </Descriptions.Item>
          <Descriptions.Item label="CreateDate">
            {moment(result.Record.creationDate).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="PublicKey">
            <div className={showPubMore ? "" : "opted"}>
              {result.Record.keyValue}
            </div>
            {result.Record.keyValue && (
              <Link to="#" onClick={this.onToggleShowPubMore}>
                show {showPubMore ? "less" : "more"}
              </Link>
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  renderTransactions = () => {
    const { result } = this.state;
    const link = `https://explorer.integraledger.com/#/tx/${result.Record.transactionId}`;
    const explorerLink = "https://explorer.integraledger.com";
    return (
      <React.Fragment>
        <p className="p-3">
          The tab shows the transaction as it was when it was written to the
          blockchain. Notice that this has the same transactionId from the
          previous tab and has no proprietary information stored. To view the
          entire blockchain explorer for Integra please visit{" "}
          <a href={explorerLink} target="_blank" rel="noopener noreferrer">
            {explorerLink}
          </a>
          . The url of the below window is{" "}
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </p>
        <iframe
          className="transaction-iframe"
          title="transactions"
          src={link}
        />
      </React.Fragment>
    );
  };

  renderBlockchain = () => {
    return (
      <Tabs defaultActiveKey="1" type="card" size="large" className="mt-3">
        <TabPane tab="GLH Private Key Metadata" key="1">
          {this.renderResult()}
        </TabPane>
        <TabPane tab="Public Key Stored on Blockchain" key="2">
          {this.renderPubkey()}
        </TabPane>
        <TabPane tab="Transaction on Blockchain" key="3">
          {this.renderTransactions()}
        </TabPane>
      </Tabs>
    );
  };

  render = () => {
    const { step, fileReading } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <h3 className="mt-4 mb-5">
            <b>Blockchain Information</b>
          </h3>
          {step === 0 && this.renderFileZone()}
          {step === 1 && this.renderBlockchain()}
          <ModalSpinner visible={fileReading} />
        </Container>
        <Footer />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
  };
};

export default connect(mapStateToProps, { dropRegFile, keyForOwner })(
  Blockchain
);
