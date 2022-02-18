import React, { Component } from "react";
import { connect } from "react-redux";
import { Skeleton, Button, Select, List, Avatar, Popconfirm } from "antd";
import { allSimpleUsers } from "../../actions/user";
import { getProject, shareProject } from "../../actions/project";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import UserAvatar from "../../assets/img/user-avatar.png";

const { Option } = Select;
class ShareProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sharers: [],
      users: [],
      selectedUsers: [],
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const curProject = await this.props.getProject(this.props.id);
    const users = await this.props.allSimpleUsers();
    this.setState({
      loading: false,
      sharers: curProject.sharers || [],
      users: users || [],
    });
  };

  handleSelected = (users) => {
    this.setState({ selectedUsers: users });
  };

  addSharers = () => {
    const { selectedUsers, sharers } = this.state;
    if (selectedUsers.length === 0) return;
    for (let u of selectedUsers) {
      let exist = sharers.filter((s) => s === u);
      if (exist.length === 0) {
        sharers.push(u);
      }
    }
    this.setState({ sharers, selectedUsers: [] });
  };

  removeSharer = (userid) => {
    const { sharers } = this.state;
    for (let i = sharers.length - 1; i >= 0; i--) {
      if (sharers[i] === userid) {
        sharers.splice(i, 1);
      }
    }
    this.setState({ sharers });
  };

  saveProject = async () => {
    const { sharers } = this.state;
    const { id, shareProject } = this.props;
    await shareProject(sharers, id);
  };

  renderUserSelect = () => {
    const { users, selectedUsers } = this.state;
    return (
      <div className="project-share-select">
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder={`Select Share ${this.props.titleParticipant}`}
          onChange={this.handleSelected}
          value={selectedUsers}
          optionLabelProp="label"
        >
          {users.map((user) => (
            <Option
              key={user._id}
              value={user._id}
              label={`${user.profile.first_name} ${user.profile.last_name}`}
            >
              <div className="demo-option-label-item">
                <img src={user.profile.photo || UserAvatar} alt="" />{" "}
                <b>{`${user.profile.first_name} ${user.profile.last_name}`}</b>{" "}
                | {user.profile.org_name}
              </div>
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={this.addSharers}>
          Add Sharers
        </Button>
      </div>
    );
  };

  renderSharers = () => {
    const { sharers, users } = this.state;
    const { label } = this.props;
    let sharingUsers = [];
    for (let i = 0; i < sharers.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (users[j]._id === sharers[i]) {
          sharingUsers.push(users[j]);
          break;
        }
      }
    }
    return (
      <List
        className="mt-5 mb-5"
        itemLayout="horizontal"
        dataSource={sharingUsers}
        renderItem={(item) => (
          <List.Item
            key={item._id}
            actions={[
              <Popconfirm
                title={`Are you sure remove this ${label.participant} from the ${label.project} access?`}
                onConfirm={() => this.removeSharer(item._id)}
                okText="Yes"
                cancelText="No"
              >
                <Link to="#">
                  <CloseCircleOutlined />
                </Link>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.profile.photo || UserAvatar} />}
              title={`${item.profile.first_name} ${item.profile.last_name}`}
              description={`${item.profile.org_name || ""} ${item.profile.country || ""}`}
            />
          </List.Item>
        )}
      />
    );
  };

  render = () => {
    const { loading } = this.state;
    const { label } = this.props;
    return (
      <div>
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && (
          <div className="project-share-modal">
            <h5>
              Share {label.titleProject} Access with {label.titleParticipant}
            </h5>
            {this.renderUserSelect()}
            {this.renderSharers()}
            <div className="btn-footer-group">
              <Button
                type="primary"
                onClick={this.saveProject}
                className="mr-4"
              >
                Save
              </Button>
              <Button onClick={this.props.hideModal}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  allSimpleUsers,
  shareProject,
  getProject,
})(ShareProject);
