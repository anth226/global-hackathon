import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Skeleton,
  PageHeader,
  Descriptions,
  Modal,
  Popover,
  Button,
} from "antd";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {
  getOrganization,
  setCurrentOrganization,
} from "../../actions/organization";
import { orgUsers } from "../../actions/auth";
import { Header, Footer, CustomCard } from "../../components/template";
import UserAvatar from "../../assets/img/user-avatar.png";
import ProjectAvatar from "../../assets/icon/challenge.png";
import {
  listOrgInvite,
  resendOrgInvite,
  deleteOrgInvite,
} from "../../actions/orginvite";
import InviteMemberForm from "./invite-member-form";
import moment from "moment";

class Organization extends Component {
  state = {
    users: [],
    loading: false,
    pendingInvites: [],
    showModal: false,
    orgInvite: null,
  };

  componentDidMount = async () => {
    const {
      match,
      organization,
      getOrganization,
      setCurrentOrganization,
      orgUsers,
      listOrgInvite,
    } = this.props;
    const id = match.params.id;
    let curOrg,
      orgInvites = [];
    for (let org of organization.organizations) {
      if (org._id === id) {
        curOrg = org;
      }
    }
    this.setState({ loading: true });
    if (curOrg) {
      setCurrentOrganization(curOrg);
    } else {
      getOrganization(id);
    }
    const users = await orgUsers(id);
    if (this.checkOrgOwner()) {
      orgInvites = await listOrgInvite(id);
    }
    this.setState({
      loading: false,
      users,
      pendingInvites: orgInvites,
    });
  };

  onOpenInviteModal = (orgInvite) => {
    const organization = this.props.match.params.id;
    this.setState({
      orgInvite: orgInvite || { organization },
      showModal: true,
    });
  };

  onHideInviteModal = async () => {
    const organization = this.props.match.params.id;
    this.setState({ orgInvite: null, showModal: false });
    let orgInvites = await this.props.listOrgInvite(organization);
    this.setState({ pendingInvites: orgInvites });
  };

  checkOrgOwner = () => {
    const { user, organization } = this.props;
    let curOrg = organization.currentOrganization;
    if (!user.profile || !user.profile.org) return false;
    if (
      user.profile.org_role === "Owner" &&
      user.profile.org._id === curOrg._id
    )
      return true;
    return false;
  };

  renderOrgInfo = () => {
    const { organization } = this.props;
    const curOrg = organization.currentOrganization;
    return (
      <Row gutter={30}>
        <Col md={6} sm={12} xs={24}>
          <div className="center mb-4">
            <img
              className="org-logo-box"
              src={curOrg.logo || ProjectAvatar}
              alt=""
            />
          </div>
        </Col>
        <Col md={18} sm={12} xs={24}>
          <PageHeader
            ghost={true}
            title={curOrg.org_name}
            subTitle={curOrg.org_type}
          >
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Website">
                {curOrg.website && (
                  <a
                    href={curOrg.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {curOrg.website}
                  </a>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {curOrg.country}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {curOrg.address}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {curOrg.state} {curOrg.city}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Contact Email">
                {curOrg.contact_email}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Phone">
                {curOrg.contact_phone}
              </Descriptions.Item> */}
            </Descriptions>
          </PageHeader>
        </Col>
      </Row>
    );
  };

  renderOrgUsers = (users) => {
    let creator,
      members = [];
    for (let u of users) {
      if (u.profile.org_role === "Owner") {
        creator = u;
        continue;
      }
      members.push(u);
    }
    return (
      <div className="mt-5">
        <h5>
          <b>{this.props.label.titleOrganization} creator</b>
        </h5>
        {creator && (
          <Row gutter={30}>
            <Col md={6} sm={12} xs={24}>
              <Link
                className="card-link"
                style={{ color: "black" }}
                to={`/participant/${creator._id}`}
              >
                <CustomCard
                  logo={creator.profile.photo || UserAvatar}
                  title={`${creator.profile.first_name} ${creator.profile.last_name}`}
                  description={`${creator.profile.country || ""}`}
                  linkedin={creator.profile.linkedin}
                  facebook={creator.profile.facebook}
                  twitter={creator.profile.twitter}
                  web={creator.profile.web}
                />
              </Link>
            </Col>
          </Row>
        )}
        <h5 className="mt-4">
          <b>
            {this.props.label.titleOrganization} members ({members.length})
          </b>
        </h5>
        <Row gutter={30}>
          {members.map((member) => (
            <Col md={6} sm={12} xs={24} key={member._id}>
              <Link
                className="card-link"
                style={{ color: "black" }}
                to={`/participant/${member._id}`}
              >
                <CustomCard
                  logo={member.profile.photo || UserAvatar}
                  title={`${member.profile.first_name} ${member.profile.last_name}`}
                  description={`${member.profile.country || ""} ${
                    member.profile.country && member.profile.org_role ? "," : ""
                  } ${member.profile.org_role || ""}`}
                  linkedin={member.profile.linkedin}
                  facebook={member.profile.facebook}
                  twitter={member.profile.twitter}
                  web={member.profile.web}
                />
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  deleteMemberInvite = async (row) => {
    await this.props.deleteOrgInvite(row._id);
    this.onHideInviteModal();
  };

  renderAction = (row) => {
    let content = (
      <div className="blue-popover">
        <ul>
          <li onClick={() => this.props.resendOrgInvite(row._id)}>
            NOTIFY AGAIN
          </li>
          <li onClick={() => this.onOpenInviteModal(row)}>EDIT INVITATION</li>
          <li onClick={() => this.deleteMemberInvite(row)}>
            CANCEL INVITATION
          </li>
        </ul>
      </div>
    );
    return (
      <Popover placement="bottomRight" content={content} trigger="click">
        <Link to="#">
          <MoreOutlined />
        </Link>
      </Popover>
    );
  };

  renderPendingMembers = () => {
    const { pendingInvites, showModal, orgInvite } = this.state;
    if (!this.checkOrgOwner()) return null;

    const waitFormatter = (cell, row) => {
      return moment(cell).fromNow();
    };
    const adminFormatter = (cell, row) => {
      return this.renderAction(row);
    };
    const columns = [
      {
        dataField: "name",
        text: "NAME",
        sort: true,
      },
      {
        dataField: "email",
        text: "Email",
      },
      {
        dataField: "role",
        text: "ROLE",
        sort: true,
      },
      {
        dataField: "createdAt",
        text: "Wait",
        formatter: waitFormatter,
      },
      {
        dataField: "",
        text: "",
        formatter: adminFormatter,
      },
    ];
    return (
      <div className="mt-5">
        <h5>
          <b className="mr-4">
            Pending Member Invitation ({pendingInvites.length})
          </b>
          <Button type="primary" onClick={() => this.onOpenInviteModal()}>
            Invite member
          </Button>
        </h5>
        {pendingInvites.length > 0 && (
          <ToolkitProvider
            bootstrap4
            keyField="_id"
            data={pendingInvites}
            columns={columns}
          >
            {(props) => (
              <BootstrapTable
                {...props.baseProps}
                bordered={false}
                wrapperClasses={`table-responsive team-table with-action`}
              />
            )}
          </ToolkitProvider>
        )}
        {showModal && (
          <Modal
            title="Member Invite"
            visible={showModal}
            width={800}
            footer={false}
            onCancel={this.onHideInviteModal}
          >
            <InviteMemberForm
              onNext={this.onHideInviteModal}
              orgInvite={orgInvite}
            />
          </Modal>
        )}
      </div>
    );
  };

  render() {
    const { organization, label } = this.props;
    const { loading, users } = this.state;
    let curOrg = organization.currentOrganization;
    if (!curOrg) {
      return (
        <React.Fragment>
          <Header />
          <div className="content container">
            <h5>No {label.organization} with this id</h5>
          </div>
          <Footer />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Header />
        <div className="content container">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && this.renderOrgInfo()}
          {!loading && this.renderOrgUsers(users)}
          {!loading && this.renderPendingMembers()}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    organization: state.organization,
    label: state.label,
    fieldData: state.profile.fieldData,
  };
}

export default connect(mapStateToProps, {
  getOrganization,
  setCurrentOrganization,
  orgUsers,
  listOrgInvite,
  resendOrgInvite,
  deleteOrgInvite,
})(Organization);
