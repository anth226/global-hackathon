import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import {
  Input,
  message,
  Steps,
  Modal,
  Radio,
  Button,
  Descriptions,
} from "antd";
import { FileDrop } from "react-file-drop";
import {
  registerUser,
  dropRegFile,
  verifyPassphrase,
  sendUserInvitation,
  updateUserLocation,
  updateUserAddress,
  checkIntegraId,
  protectedTest,
} from "../../actions/auth";
import { createLocation, listLocation } from "../../actions/location";
import { Header } from "../../components/template";
import UploadIcon from "../../assets/icon/upload.png";
import { UserRoles } from "../../constants";
import { ModalSpinner } from "../../components/pages/spinner";
import HomeBoard from "../home/homeboard";
import {
  SignupForm,
  InviteForm,
  RegisterLocationForm,
  ChooseLocationForm,
} from "./forms";
import history from "../../history";

const { Step } = Steps;
const { Search } = Input;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      pdfData: {},
      fileReading: false,
      showConfModal: false,
      role: UserRoles[0].value,
      email: "",
    };
    this.fileInputRef = React.createRef(null);
  }

  componentDidMount = () => {
    this.props.listLocation();
  };

  onSubmit = async (values) => {
    const { registerUser } = this.props;
    values.role = this.state.role;
    const success = await registerUser(values);
    if (success) {
      this.setState({ step: 3, email: values.email });
    }
  };

  handleDropFile = async (files, e) => {
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true });
    const res = await this.props.dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    this.setState({
      pdfData: res.data.result,
      showConfModal: true,
      fileReading: false,
    });
  };

  onSelectFile = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    this.setState({ fileReading: true });
    const res = await this.props.dropRegFile(files[0]);
    if (!res.data.result) {
      message.error("Invalid file format!");
      this.setState({ fileReading: false });
      return;
    }
    this.setState({
      pdfData: res.data.result,
      showConfModal: true,
      fileReading: false,
    });
  };

  onConfirm = async (passphrase) => {
    const { pdfData } = this.state;
    const { verifyPassphrase, loc, checkIntegraId } = this.props;
    const verified = await verifyPassphrase(pdfData, passphrase);
    if (verified) {
      const result = await checkIntegraId(pdfData.integraid);
      if (result) {
        this.setState({ showConfModal: false, step: loc.inv_locaton ? 2 : 1 });
      } else {
        this.setState({ showConfModal: false });
      }
    } else {
      this.setState({ showConfModal: false });
    }
  };

  onChangeRole = (e) => {
    this.setState({ role: e.target.value });
  };

  onGoNext = () => {
    this.setState({ step: this.state.step + 1 });
  };

  onGoBack = () => {
    this.setState({ step: this.state.step - 1 });
  };

  onGoHome = async () => {
    await this.props.protectedTest();
    history.push("/profile");
  };

  onTargetClick = (e) => {
    this.fileInputRef.current.click();
  };

  onSelectLocation = async (locationId) => {
    await this.props.updateUserLocation(locationId, this.state.email);
    this.setState({ step: 4 });
  };

  onUpdateAddress = async (data) => {
    await this.props.updateUserAddress(
      data.country,
      data.city,
      this.state.email
    );
    this.setState({ step: 4 });
  };

  onCreateLocation = async (values) => {
    const success = await this.props.createLocation(values, this.state.email);
    if (success) this.setState({ step: 4 });
  };

  renderSteps = () => {
    const inv_loc = this.props.loc.inv_locaton;
    const { step, role } = this.state;
    return (
      <div className="steps-block">
        <Steps progressDot size="default">
          <Step
            status={step > 0 ? "finish" : "process"}
            title="GLH Private Key"
          />
          {!inv_loc && (
            <Step
              status={step < 1 ? "wait" : step === 1 ? "process" : "finish"}
              title="Role"
            />
          )}
          <Step
            status={step < 2 ? "wait" : step === 2 ? "process" : "finish"}
            title={this.state.role}
          />
          <Step
            status={step < 3 ? "wait" : step === 3 ? "process" : "finish"}
            title={role === "Host" ? "Venue" : "Location"}
          />
          <Step status={step < 4 ? "wait" : "process"} title="Done" />
        </Steps>
      </div>
    );
  };

  renderIdentity = () => {
    return (
      <div className="identity-drop">
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

  renderRoles = () => {
    return (
      <div className="choose-roles">
        <div className="role-header">
          <h5>
            <b>Register as</b>
          </h5>
        </div>
        <div className="role-content">
          <Radio.Group
            name="radiogroup"
            defaultValue={UserRoles[0].value}
            onChange={this.onChangeRole}
          >
            {UserRoles.map((role) => (
              <React.Fragment key={role.label}>
                <Radio value={role.value}>{role.label}</Radio>
                <div className="role-desc">{role.description}</div>
              </React.Fragment>
            ))}
          </Radio.Group>
          <button className="blue-btn" onClick={this.onGoNext}>
            Continue
          </button>
        </div>
      </div>
    );
  };

  renderLocation = () => {
    const inv_loc = this.props.loc.inv_locaton;
    const locations = this.props.loc.locations;
    const myLoc = locations.filter((item) => item._id === inv_loc);
    if (this.state.role === "Host") {
      return <RegisterLocationForm onSubmit={this.onCreateLocation} />;
    }
    if (!inv_loc) {
      return (
        <ChooseLocationForm
          onSubmit={this.onSelectLocation}
          locations={this.props.loc.locations}
          onSetLocation={this.onUpdateAddress}
        />
      );
    }
    if (myLoc.length === 0) return null;
    return (
      <div className="location-info">
        <Descriptions title="Location Information">
          <Descriptions.Item label="Venue">{myLoc[0].venue}</Descriptions.Item>
          <Descriptions.Item label="Country">
            {myLoc[0].venue_country}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {myLoc[0].venue_city}
          </Descriptions.Item>
          <Descriptions.Item label="Street">
            {myLoc[0].venue_street}
          </Descriptions.Item>
          <Descriptions.Item label="Zip">
            {myLoc[0].venue_zip}
          </Descriptions.Item>
          <Descriptions.Item label="Organization">
            {myLoc[0].organization}
          </Descriptions.Item>
        </Descriptions>
        <Button
          className="mt-4"
          type="primary"
          onClick={() => this.onSelectLocation(inv_loc)}
        >
          Continue
        </Button>
      </div>
    );
  };

  renderInvite = () => {
    return (
      <div className="invite-block">
        <p className="center-block">
          Tell the world that you registered for #GLH2022
        </p>
        <InviteForm
          onSubmit={this.props.sendUserInvitation}
          onContinue={this.onGoHome}
          invId={"testinvid"}
        />
      </div>
    );
  };

  render() {
    const { step, fileReading, pdfData, showConfModal, role } = this.state;
    return (
      <React.Fragment>
        <Header />
        <HomeBoard />
        <div className="identity-container">
          <Container>
            {this.renderSteps()}
            {step === 0 && this.renderIdentity()}
            {step === 1 && this.renderRoles()}
            {step === 2 && (
              <SignupForm
                onSubmit={this.onSubmit}
                invId={pdfData.integraid}
                role={role}
              />
            )}
            {step === 3 && this.renderLocation()}
            {step === 4 && this.renderInvite()}
          </Container>
          <ModalSpinner visible={fileReading} />
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
    loc: state.loc,
  };
}

export default connect(mapStateToProps, {
  registerUser,
  dropRegFile,
  verifyPassphrase,
  sendUserInvitation,
  updateUserLocation,
  updateUserAddress,
  createLocation,
  listLocation,
  checkIntegraId,
  protectedTest,
})(Register);
