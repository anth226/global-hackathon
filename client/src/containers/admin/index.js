import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb, Badge } from "antd";
import {
  IssuesCloseOutlined,
  ProjectOutlined,
  UserOutlined,
  SettingOutlined,
  GlobalOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Header } from "../../components/template";
import history from "../../history";
import UserAll from "./user/all";
import Creators from "./user/creators";
import Message from "./user/message";
import Reports from "./user/report";
import Verify from "./user/unverified";
import Constants from "./constants";
import ChallengeAll from "./challenge/challenge_report";
import ChallengePending from "./challenge/challenge_pending";
import ProjectAll from "./project/project_report";
import SiteSetting from "./setting";
import Announcement from "./setting/announce";
import HelpDoc from "./help";
import EmailTemplate from "./setting/email-template";
import Resource from "./resource";
import Faq from "./faq";
import JudgePage from "./setting/judge";
import OverallGallery from "./gallery/overall";
import LocationAll from "./location/all";
import ResetPwdPage from "./setting/reset_password";
import MenuItem from "antd/lib/menu/MenuItem";
import SponsorsPage from "./sponsor/all";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

class AdminDashboard extends Component {
  state = {
    collapsed: false,
    pageTitle: "",
    submenu: "",
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    if (!this.props.isAdmin) {
      history.push("/dashboard");
      return;
    }
  }

  switchPage = (submenu, pageTitle) => {
    this.setState({ submenu, pageTitle });
  };

  render() {
    const { pageTitle, submenu } = this.state;
    const { label, loc } = this.props;
    const locations = loc.pendingLocations;

    return (
      <React.Fragment>
        <Header />
        <Layout className="message-box">
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <UserOutlined />
                    <span>{label.titleParticipant}</span>
                  </span>
                }
              >
                <Menu.Item
                  key="pt-all"
                  onClick={() => this.switchPage("Participant", "All")}
                >
                  All
                </Menu.Item>
                <Menu.Item
                  key="proj-own"
                  onClick={() =>
                    this.switchPage("Participant", "Project Owners")
                  }
                >
                  {label.titleProject} Owners
                </Menu.Item>
                <Menu.Item
                  key="pt-msg"
                  onClick={() => this.switchPage("Participant", "Message")}
                >
                  Message
                </Menu.Item>
                <Menu.Item
                  key="pt-rpt"
                  onClick={() => this.switchPage("Participant", "Report")}
                >
                  Report
                </Menu.Item>
                <Menu.Item
                  key="pt-vrf"
                  onClick={() => this.switchPage("Participant", "Verify")}
                >
                  Unverified
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub11"
                title={
                  <span>
                    <Badge count={locations.length}>
                      <GlobalOutlined />
                      <span>Location</span>
                    </Badge>
                  </span>
                }
              >
                <Menu.Item
                  key="loc-all"
                  onClick={() => this.switchPage("Location", "All")}
                >
                  All
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <IssuesCloseOutlined />
                    <span>{label.titleChallenge}</span>
                  </span>
                }
              >
                <Menu.Item
                  key="chl-all"
                  onClick={() => this.switchPage("Challenge", "All")}
                >
                  All
                </Menu.Item>
                <Menu.Item
                  key="chl-pending"
                  onClick={() => this.switchPage("Challenge", "Pending")}
                >
                  Pending
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub4"
                title={
                  <span>
                    <ProjectOutlined />
                    <span>{label.titleProject}</span>
                  </span>
                }
              >
                <Menu.Item
                  key="prj-all"
                  onClick={() => this.switchPage("Project", "All")}
                >
                  All
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="gallery"
                title={
                  <span>
                    <ProjectOutlined />
                    <span>Gallery</span>
                  </span>
                }
              >
                <Menu.Item
                  key="gallery-overall"
                  onClick={() => this.switchPage("Gallery", "OverAll")}
                >
                  Overall results
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sponsor"
                title={
                  <span>
                    <WalletOutlined />
                    <span>Sponsors</span>
                  </span>
                }
              >
                <MenuItem
                  key="sponsor-all"
                  onClick={() => this.switchPage("Sponsors", "All")}
                >
                  All
                </MenuItem>
              </SubMenu>
              {this.props.isSuper && (
                <SubMenu
                  key="sub6"
                  title={
                    <span>
                      <SettingOutlined />
                      <span>Setting</span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="set-cst"
                    onClick={() => this.switchPage("Setting", "Constants")}
                  >
                    Constants
                  </Menu.Item>
                  <Menu.Item
                    key="set-sset"
                    onClick={() => this.switchPage("Setting", "SiteSetting")}
                  >
                    Site Setting
                  </Menu.Item>
                  <Menu.Item
                    key="set-anc"
                    onClick={() => this.switchPage("Setting", "Announce")}
                  >
                    Announcement
                  </Menu.Item>
                  <Menu.Item
                    key="set-help"
                    onClick={() => this.switchPage("Setting", "Help")}
                  >
                    Help Setting
                  </Menu.Item>
                  <Menu.Item
                    key="email-template"
                    onClick={() => this.switchPage("Setting", "Email")}
                  >
                    Email Templates
                  </Menu.Item>
                  <Menu.Item
                    key="faq"
                    onClick={() => this.switchPage("Setting", "Faq")}
                  >
                    Faq
                  </Menu.Item>
                  <Menu.Item
                    key="judge"
                    onClick={() => this.switchPage("Setting", "Judges")}
                  >
                    Judges
                  </Menu.Item>
                  <Menu.Item
                    key="rpwd"
                    onClick={() => this.switchPage("Setting", "Reset_Password")}
                  >
                    Reset Password
                  </Menu.Item>
                </SubMenu>
              )}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>{submenu}</Breadcrumb.Item>
                <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
              </Breadcrumb>
              <div className="admin-main">{this.renderPage()}</div>
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    );
  }

  renderPage = () => {
    const { pageTitle, submenu } = this.state;
    let pageName = `${submenu} ${pageTitle}`;
    switch (pageName) {
      case "Participant All":
        return <UserAll />;
      case "Participant Project Owners":
        return <Creators />;
      case "Participant Message":
        return <Message />;
      case "Participant Report":
        return <Reports />;
      case "Participant Verify":
        return <Verify />;
      case "Location All":
        return <LocationAll />;
      case "Challenge All":
        return <ChallengeAll />;
      case "Challenge Pending":
        return <ChallengePending />;
      case "Project All":
        return <ProjectAll />;
      case "Gallery OverAll":
        return <OverallGallery />;
      case "Setting Constants":
        return <Constants />;
      case "Setting SiteSetting":
        return <SiteSetting />;
      case "Setting Announce":
        return <Announcement />;
      case "Setting Help":
        return <HelpDoc />;
      case "Setting Email":
        return <EmailTemplate />;
      case "Resource All":
        return <Resource />;
      case "Setting Faq":
        return <Faq />;
      case "Setting Judges":
        return <JudgePage />;
      case "Setting Reset_Password":
        return <ResetPwdPage />;
      case "Sponsors All":
        return <SponsorsPage />;
      default:
        return null;
    }
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    isAdmin: state.user.isAdmin,
    isSuper: state.user.isSuper,
    label: state.label,
    loc: state.loc,
  };
};

export default connect(mapStateToProps, {})(AdminDashboard);
