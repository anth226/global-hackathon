import React, { Component } from "react";
import { connect } from "react-redux";
import { Header } from "../../components/template";
import {
  fetchMessages,
  sendReply,
  setOnMessage,
  setChannel,
  updateMessage,
  deleteMessage,
  inviteMembers,
  blockChat,
  setDecrypt,
} from "../../actions/message";
import { getProject, getParticipant } from "../../actions/project";
import {
  Layout,
  Menu,
  Breadcrumb,
  Tooltip,
  List,
  Comment,
  Input,
  Badge,
  Button,
  Modal,
  Checkbox,
  Mentions,
  Popconfirm,
  Spin,
} from "antd";
import moment from "moment";
import UserAvatar from "../../assets/img/user-avatar.png";
import { Link } from "react-router-dom";
import TeamIcon from "../../assets/img/team-icon.png";
import { MehOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import KeyModal from "./key_modal";
import { getOneFieldData } from "../../utils/helper";

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Mentions;

class MessageBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      receptor: "",
      receptorId: "",
      messageText: "",
      curMessageId: "",
      searchTxt: "",
      isTeamChat: false,
      inviteModal: false,
      inviteMembers: [],
      showDropModal: false,
      sending: false,
    };
  }

  messagesEndRef = React.createRef();

  componentDidMount = async () => {
    const { setOnMessage, fetchMessages, message, user, fieldData } =
      this.props;
    setOnMessage(true);
    if (message.channelId) {
      await fetchMessages(message.channelId);
    }

    const chatEncrypt = !!getOneFieldData(fieldData, "chat_encrypt");
    if (!chatEncrypt) return;
    let key = JSON.parse(localStorage.getItem("integra_key"));
    if (!key || (user._id && user._id !== key.user_id) || !key.private_key) {
      this.toggleDropzoneModal();
    }
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.props.setOnMessage(false);
  }

  toggleDropzoneModal = () => {
    this.setState({ showDropModal: !this.state.showDropModal });
  };

  onChangeSearch = (e) => {
    this.setState({ searchTxt: e.target.value });
  };

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onClickConversation = async (cvId, name, id, isTeamChat) => {
    const { fetchMessages, setChannel, getProject, setDecrypt } = this.props;
    setDecrypt(false);
    await fetchMessages(cvId);
    setChannel(cvId);
    this.setState({ receptor: name, receptorId: id, isTeamChat });
    this.scrollToBottom();
    if (isTeamChat) getProject(id);
  };

  toggleDecrypt = async () => {
    const { message, setDecrypt, fetchMessages } = this.props;
    if (message.decrypt) {
      setDecrypt(false);
      await fetchMessages(message.channelId);
    } else {
      setDecrypt(true);
      await fetchMessages(message.channelId);
    }
    this.scrollToBottom();
  };

  renderMenuItem = (cv) => {
    const { user } = this.props;
    const { searchTxt } = this.state;
    let name = cv.name,
      photo = TeamIcon,
      isTeamChat = true,
      id = cv.project;
    if (!cv.project) {
      let users = cv.participants;
      if (users.length < 2) return null;
      let receptor = users[0];
      if (receptor._id === user._id) {
        receptor = users[1];
      }
      name = `${receptor.profile.first_name} ${receptor.profile.last_name}`;
      photo = receptor.profile.photo || UserAvatar;
      id = receptor._id;
      isTeamChat = false;
    }
    if (searchTxt && !name.toLowerCase().includes(searchTxt.toLowerCase())) {
      return null;
    }

    return (
      <Menu.Item
        key={cv._id}
        onClick={() => this.onClickConversation(cv._id, name, id, isTeamChat)}
        title={name}
      >
        <React.Fragment>
          <Badge count={cv.unread} style={{ backgroundColor: "#52c41a" }}>
            <img className="anticon" src={photo} alt="logo" />
          </Badge>
          <span className="menu-name">{name}</span>
        </React.Fragment>
      </Menu.Item>
    );
  };

  processMessage = () => {
    const { message } = this.props;
    const messages = message.messages || [];
    let result = [];
    for (let m of messages) {
      let author = `${m.author.profile.first_name} ${m.author.profile.last_name}`;
      let avatar = m.author.profile.photo || UserAvatar;
      if (!message.decrypt && m.body_author) {
        m.body = m.body.slice(0, 150) + "...";
      }
      let content = <p>{m.body}</p>;
      let datetime = (
        <Tooltip title={moment(m.createdAt).format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment(m.createdAt).fromNow()}</span>
        </Tooltip>
      );
      result.push({
        author,
        avatar,
        content,
        datetime,
        messageId: m._id,
        authorId: m.author._id,
        text: m.body,
      });
    }
    return result;
  };

  sendMessage = async () => {
    const { sendReply, updateMessage, fetchMessages, deleteMessage, message } =
      this.props;
    const { curMessageId, messageText } = this.state;
    this.setState({ sending: true });
    if (curMessageId) {
      if (messageText) {
        await updateMessage(curMessageId, messageText);
      } else {
        await deleteMessage(curMessageId, message.channelId);
      }
    } else {
      if (!messageText) return;
      await sendReply(message.channelId, messageText);
    }
    await fetchMessages(message.channelId);
    this.setState({ messageText: "", curMessageId: "", sending: false });
    this.scrollToBottom();
  };

  mkCommentActions = (item) => {
    const { user, deleteMessage, message, fieldData } = this.props;
    let actions = [];
    const chatEncrypt = !!getOneFieldData(fieldData, "chat_encrypt");
    if (item.authorId !== user._id) return actions;
    if (chatEncrypt && !message.decrypt) return actions;
    actions.push(
      <span
        key="message-edit"
        className="text-underline"
        onClick={() =>
          this.setState({
            curMessageId: item.messageId,
            messageText: item.text,
          })
        }
      >
        Edit
      </span>
    );
    actions.push(
      <span
        key="comment-delete"
        className="text-underline"
        onClick={() => deleteMessage(item.messageId, message.channelId)}
      >
        Delete
      </span>
    );
    return actions;
  };

  showInviteModal = async () => {
    await this.props.getParticipant(this.state.receptorId);
    this.setState({ inviteModal: true });
  };

  hideInviteModal = () => {
    this.setState({ inviteModal: false });
  };

  onChangeInvitedMembers = (values) => {
    this.setState({ inviteMembers: values });
  };

  renderInviteMembers = () => {
    const { project, message } = this.props;
    let curMemebers = [];
    for (let cv of message.conversations) {
      if (cv._id === message.channelId) {
        curMemebers = cv.participants;
      }
    }
    const temMembers = project.participants.filter(
      (item) => item.member === true
    );
    if (temMembers.length === 0) {
      return <p>There is no member in the project</p>;
    }
    let options = temMembers.map((item) => {
      return {
        label: `${item.participant.profile.first_name} ${item.participant.profile.last_name}`,
        value: item.participant._id,
        disabled: curMemebers.some((cm) => cm._id === item.participant._id),
      };
    });
    return (
      <Checkbox.Group
        options={options}
        onChange={this.onChangeInvitedMembers}
      />
    );
  };

  onInviteMembers = () => {
    const { inviteMembers } = this.state;
    if (inviteMembers.length === 0) return;
    this.props.inviteMembers(this.props.message.channelId, inviteMembers);
    this.hideInviteModal();
  };

  getMemberNames = () => {
    const { message } = this.props;
    let curMemebers = [];
    for (let cv of message.conversations) {
      if (cv._id === message.channelId) {
        curMemebers = cv.participants.map((item) => {
          return `${item.profile.first_name} ${item.profile.last_name}`;
        });
        return curMemebers;
      }
    }
    return curMemebers;
  };

  render() {
    const { message, blockChat, fieldData } = this.props;
    const {
      messageText,
      receptor,
      receptorId,
      searchTxt,
      isTeamChat,
      inviteModal,
      showDropModal,
      sending,
    } = this.state;
    const conversations = message.conversations;
    const memberNames = this.getMemberNames();
    const chatEncrypt = !!getOneFieldData(fieldData, "chat_encrypt");

    return (
      <React.Fragment>
        <Header />
        <Layout className="message-box">
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu theme="dark" selectedKeys={[message.channelId]} mode="inline">
              <Menu.Item
                className="search-conversation"
                key={"search-conversation"}
              >
                <Search
                  value={searchTxt}
                  onChange={this.onChangeSearch}
                  placeholder="search"
                />
              </Menu.Item>
              {conversations.map((cv) => {
                return this.renderMenuItem(cv);
              })}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>{receptor}</Breadcrumb.Item>
                {!isTeamChat && receptorId && (
                  <Popconfirm
                    placement="bottomRight"
                    title="Are you sure block this user?"
                    onConfirm={() => blockChat(receptorId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Link className="link-block" title="Block User" to="#">
                      <MehOutlined />
                    </Link>
                  </Popconfirm>
                )}
              </Breadcrumb>
              <div className="site-layout-background">
                <List
                  className="comment-list"
                  itemLayout="horizontal"
                  dataSource={this.processMessage()}
                  renderItem={(item) => (
                    <li>
                      <Comment
                        actions={this.mkCommentActions(item)}
                        author={item.author}
                        avatar={item.avatar}
                        content={item.content}
                        datetime={item.datetime}
                      />
                    </li>
                  )}
                />
                <div>
                  {message.channelId && (
                    <div className="message-input">
                      <Mentions
                        value={messageText}
                        onChange={(value) =>
                          this.setState({ messageText: value })
                        }
                        placeholder="Message"
                        rows={3}
                      >
                        {memberNames.map((name) => (
                          <Option key={name} value={name}>
                            {name}
                          </Option>
                        ))}
                      </Mentions>
                      <div className="btn-group">
                        <Button type="primary" onClick={this.sendMessage}>
                          {sending && (
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
                          Send
                        </Button>
                        {chatEncrypt && (
                          <Button type="primary" onClick={this.toggleDecrypt}>
                            {message.decrypt ? "Encrypt" : "Decrypt"}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <div ref={this.messagesEndRef} />
                </div>
              </div>
              <Modal
                title="Invite Team Members"
                visible={inviteModal}
                onCancel={this.hideInviteModal}
                onOk={this.onInviteMembers}
                okText="Invite"
              >
                {this.renderInviteMembers()}
              </Modal>
            </Content>
          </Layout>
        </Layout>
        {showDropModal && (
          <Modal
            title="GLH Key Verification"
            visible={showDropModal}
            width={1000}
            footer={false}
            centered
          >
            <KeyModal onClose={this.toggleDropzoneModal} />
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.message,
    user: state.user.profile,
    project: state.project,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  fetchMessages,
  sendReply,
  setChannel,
  setOnMessage,
  updateMessage,
  deleteMessage,
  getProject,
  getParticipant,
  inviteMembers,
  blockChat,
  setDecrypt,
})(MessageBox);
