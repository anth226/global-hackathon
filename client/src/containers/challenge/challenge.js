import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";
import { Container, Row, Col } from "reactstrap";
import { Tag, Skeleton, message, List, Card, Avatar } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { Header, Footer, CustomCard } from "../../components/template";
import {
  getChallenge,
  supportChallenge,
  upvoteChallenge,
} from "../../actions/challenge";
import {
  updateProject,
  createProject,
  challengeProjects,
} from "../../actions/project";
import { listChallengeComment } from "../../actions/comment";
import ProjectAvatar from "../../assets/icon/challenge.png";
import CreateForm from "../../components/project/create_project";
import Tags from "../../components/pages/tags";
import Comments from "../../components/project/challenge_comment";

const { Meta } = Card;

class Challenge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreate: false,
      challenge: {},
      projects: [],
      curProject: {},
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const id = this.props.match.params.id;
    const challenge = await this.props.getChallenge(id);
    const projects = await this.props.challengeProjects(id);
    await this.props.listChallengeComment(id);
    this.setState({ challenge, projects, loading: false });
  };

  handleSupport = async (support) => {
    const { getChallenge, supportChallenge, match } = this.props;
    await supportChallenge(match.params.id, support);
    const challenge = await getChallenge(match.params.id);
    this.setState({ challenge });
  };

  handleUpvote = async (vote) => {
    const { getChallenge, upvoteChallenge, match } = this.props;
    await upvoteChallenge(match.params.id, vote);
    const challenge = await getChallenge(match.params.id);
    this.setState({ challenge });
  };

  handleCreate = () => {
    if (this.props.user.role === "Restrict") {
      message.warn(`You are not allowed to create ${this.props.label.project}`);
      return;
    }
    this.setState({
      isCreate: true,
      curProject: {
        participant: this.props.user._id,
        organization: this.props.authOrg._id,
        challenge: this.props.match.params.id,
        public: true,
      },
      isModalOpen: false,
    });
  };

  handleUpdate = (curProject) => {
    this.setState({ isCreate: true, curProject });
  };

  hideProjectCreate = async (project) => {
    const { projects, curProject } = this.state;
    if (!project) {
      this.setState({ isCreate: false });
      return;
    }
    let newPros = projects;
    if (!curProject._id) {
      newPros = [...projects, project];
    } else {
      for (let i = 0; i < newPros.length; i++) {
        if (newPros[i]._id === project._id) newPros[i] = project;
      }
    }
    this.setState({ projects: newPros, isCreate: false });
  };

  handleClickShare = (isModalOpen) => {
    this.setState({ isModalOpen });
  };

  checkSupporting = () => {
    const { challenge } = this.state;
    const { authOrg } = this.props;
    let filters = challenge.supports.filter((spt) => spt._id === authOrg._id);
    if (filters.length > 0) return true;
    return false;
  };

  render = () => {
    const { isCreate, curProject, loading } = this.state;
    const { createProject, label, match, fieldData } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          {isCreate ? (
            <div className="login-page">
              <h4 className="mt-3 mb-4">Create {label.titleProject}</h4>
              <CreateForm
                onSubmit={createProject}
                curProject={curProject}
                hideProjectCreate={this.hideProjectCreate}
                label={label}
                fieldData={fieldData}
              />
            </div>
          ) : (
            <div className="user-dashboard list-view">
              {this.renderChallengeInfo()}
              {!loading && <Comments challengeId={match.params.id} />}
              {/* {this.renderProjects()} */}
              {/* {this.renderSupports()} */}
            </div>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderChallengeInfo = () => {
    const { challenge, loading } = this.state;
    const { user, fieldData, label } = this.props;
    if (loading || !challenge._id) {
      return (
        <Row>
          <Skeleton active loading={loading} />
        </Row>
      );
    }
    if (!challenge.supports) challenge.supports = [];
    if (!challenge.likes) challenge.likes = [];
    const isVoter = challenge.likes.includes(user._id);

    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={challenge.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h3>{challenge.challenge_name}</h3>
          <b>Short Description</b>
          <p>{challenge.short_description}</p>
          <b>Geography</b>
          <p>{challenge.geography}</p>
          <b>Who will this {label.challenge} benefit?</b>
          <p>{challenge.benefit}</p>
          <b>Stakeholders</b>
          <p>{challenge.stackholders}</p>
          <b>Keywords</b>
          <p>{challenge.keywords}</p>
          <b>Description</b>
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: challenge.description }}
          />
          <Tags
            fieldData={fieldData}
            tags={challenge.tags || []}
            prefix={"challenge"}
          />
          <div className="flex mt-4">
            <p>
              {isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(false)}>
                  <LikeFilled />
                </Link>
              )}
              {!isVoter && (
                <Link to="#" onClick={() => this.handleUpvote(true)}>
                  <LikeOutlined />
                </Link>
              )}
              <span> {challenge.likes.length}</span>
            </p>
          </div>
        </Col>
      </Row>
    );
  };

  renderModalChallengeInfo = (challenge) => {
    const shareURL = `${process.env.REACT_APP_API_HOST}/public/challenge/${challenge._id}`;
    return (
      <Row>
        <Col xl={4} md={6} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={challenge.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
        </Col>
        <Col xl={8} md={6}>
          <h3>{challenge.challenge_name}</h3>
          <p>{challenge.short_description}</p> <br />
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: challenge.description }}
          />
          <TwitterShareButton className="mr-2" url={shareURL}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <FacebookShareButton className="mr-2" url={shareURL}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url={shareURL}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>
        </Col>
      </Row>
    );
  };

  renderProjects = () => (
    <React.Fragment>
      <h5 className="mt-4">{this.props.label.titleProject}</h5>
      <Row>
        {this.state.projects.map((item, index) => {
          return (
            <Col key={index} lg={3} md={6} sm={12}>
              <Link className="card-link" to={`/project/${item._id}`}>
                <CustomCard
                  logo={item.logo || ProjectAvatar}
                  title={item.name}
                  description={item.short_description}
                />
              </Link>
              {(item.participant === this.props.user._id ||
                item.organization === this.props.authOrg._id) && (
                <div className="edit-chal">
                  <Tag color="purple" onClick={() => this.handleUpdate(item)}>
                    Edit {this.props.label.titleProject}
                  </Tag>
                </div>
              )}
            </Col>
          );
        })}
        {!this.props.isJudge && (
          <Col lg={3} md={6} sm={12}>
            <div
              className="custom-card mt-4"
              style={{
                backgroundImage: "linear-gradient(#404668, #151d4d, #1a245d)",
                color: "white",
              }}
            >
              <p style={{ fontSize: "14px", marginTop: 10 }}>JOIN IN</p>
              <div className="mb-4" />
              <p style={{ fontSize: "14px" }}>
                Interested in Creating New {this.props.label.titleProject}?
              </p>
              <div className="mb-4" />
              <button
                className="btn-custom-card mt-4"
                onClick={() => this.handleCreate()}
              >
                Create
              </button>
            </div>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );

  renderSupports = () => {
    const { challenge, loading } = this.state;
    if (
      loading ||
      !challenge._id ||
      !challenge.supports ||
      challenge.supports.length === 0
    )
      return null;

    return (
      <React.Fragment>
        <h5 className="mt-5">
          Supporting {this.props.label.titleOrganization}
        </h5>
        <List
          itemLayout="horizontal"
          dataSource={challenge.supports}
          renderItem={(item) => (
            <Card className="homepage-card name">
              <Meta
                title={
                  <Link to={`/organization/${item._id}`}>{item.org_name}</Link>
                }
                avatar={<Avatar src={item.logo || ProjectAvatar} />}
                description={`${item.city || ""} ${item.country || ""}`}
              />
            </Card>
          )}
        />
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    authOrg: state.organization.authOrg,
    fieldData: state.profile.fieldData,
    isJudge: state.user.isJudge,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getChallenge,
  challengeProjects,
  createProject,
  updateProject,
  supportChallenge,
  upvoteChallenge,
  listChallengeComment,
})(Challenge);
