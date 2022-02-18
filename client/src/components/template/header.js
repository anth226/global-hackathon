import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Avatar, Badge, Drawer, Modal } from "antd";
import { BellOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import sampleUrl from "../../assets/img/user-avatar.png";
import Logo from "../../assets/icon/logo.svg";
import { setShowInstruct } from "../../actions/auth";

class HeaderTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  renderNavs = () => {
    const {
      authenticated,
      currentUser,
      message,
      notification,
      isAdmin,
      isJudge,
      loc,
      setShowInstruct,
    } = this.props;
    const locations = loc.pendingLocations;

    return (
      <React.Fragment>
        <Nav className="mr-auto" navbar>
          {authenticated && (
            <NavItem>
              <Link className="nav-link" to={"/dashboard"}>
                Dashboard
              </Link>
            </NavItem>
          )}
          {authenticated && isAdmin && (
            <NavItem>
              <Link className="nav-link" to="/admin">
                <Badge count={locations.length}>Admin</Badge>
              </Link>
            </NavItem>
          )}
        </Nav>

        <Nav navbar>
          {authenticated && !isJudge && (
            <NavItem>
              <Link className="nav-link" to="/message">
                <div
                  className="mr-2"
                  style={{
                    fontSize: 21,
                    color: "white",
                  }}
                >
                  <Badge count={message.unread}>
                    <MailOutlined />
                  </Badge>
                </div>
              </Link>
            </NavItem>
          )}
          {authenticated && !isJudge && (
            <NavItem>
              <Link className="nav-link" to="/notification">
                <div
                  className="mr-2"
                  style={{
                    fontSize: 21,
                    color: "white",
                  }}
                >
                  <Badge count={notification.unread}>
                    <BellOutlined />
                  </Badge>
                </div>
              </Link>
            </NavItem>
          )}
          {authenticated && (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {currentUser.profile && (
                  <React.Fragment>
                    <Avatar src={currentUser.profile.photo || sampleUrl} />{" "}
                    &nbsp;
                    {`${currentUser.profile.first_name} ${currentUser.profile.last_name}`}
                  </React.Fragment>
                )}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link
                    className="nav-link"
                    to={isJudge ? "/judge-profile" : "/profile"}
                  >
                    Edit Profile
                  </Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {!authenticated && (
            <NavItem>
              <a
                className="nav-link super-link"
                href="https://globallegalhackathon.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GLH Home
              </a>
            </NavItem>
          )}
          {!authenticated && (
            <NavItem>
              <Link
                className="nav-link super-link"
                to="#"
                onClick={() => {
                  setShowInstruct(true);
                }}
              >
                How to Register
              </Link>
            </NavItem>
          )}
          {!authenticated && (
            <NavItem>
              <Link
                className="nav-link super-link"
                to="/privacy-policy"
                target={"_blank"}
              >
                Privacy Policy
              </Link>
            </NavItem>
          )}
        </Nav>
      </React.Fragment>
    );
  };

  render = () => {
    const { isAdmin, auth, setShowInstruct, authenticated } = this.props;
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <div className={`main-nav ${isAdmin && "admin-nav"}`}>
          <Navbar className="container-nav" expand="md" light>
            <Link
              className="navbar-brand"
              to={authenticated ? "/dashboard" : "/"}
            >
              <img src={Logo} alt="logo" />
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={false} navbar className="nav-body">
              {this.renderNavs()}
            </Collapse>
            <Drawer
              title="#GLH2022"
              placement="left"
              onClose={this.toggle}
              visible={isOpen}
              size="large"
              className="nav-body"
            >
              {this.renderNavs()}
            </Drawer>
          </Navbar>
        </div>
        {auth.show_instruct && (
          <Modal
            visible={auth.show_instruct}
            width={700}
            footer={false}
            centered
            onCancel={() => setShowInstruct(false)}
            className="instruct_modal"
          >
            {!auth.instruct && (
              <div className="instructs">
                <button
                  className="blue-btn"
                  onClick={() => setShowInstruct(true, "host")}
                >
                  Host Registration Instructions
                </button>
                <button
                  className="blue-btn"
                  onClick={() => setShowInstruct(true, "participant")}
                >
                  Participant Registration Instructions
                </button>
              </div>
            )}
            {auth.instruct === "host" && (
              <div className="instruct-item">
                <h4>Host Registration Instructions</h4>
                <iframe
                  src="https://player.vimeo.com/video/651298961?h=bb544837a1"
                  title="host instruction"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                ></iframe>
              </div>
            )}
            {auth.instruct === "participant" && (
              <div className="instruct-item">
                <h4>Participant Registration Instructions</h4>
                <iframe
                  src="https://player.vimeo.com/video/651296973?h=ba9034d33c"
                  title="participant instruction"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                ></iframe>
              </div>
            )}
          </Modal>
        )}
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    currentUser: state.user.profile,
    isAdmin: state.user.isAdmin,
    isJudge: state.user.isJudge,
    message: state.message,
    notification: state.notification,
    fieldData: state.profile.fieldData,
    label: state.label,
    loc: state.loc,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { setShowInstruct })(HeaderTemplate);
