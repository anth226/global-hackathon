import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Header, Footer } from "../../components/template";
import { Skeleton, Button, Modal, Tooltip } from "antd";
import { getGallery, privateGallery } from "../../actions/gallery";
import {
  getPublicParticipant,
  getProject,
  contactProjectCreator,
  createProjectVote,
  updateProjectVote,
} from "../../actions/project";
import ContactForm from "../../components/gallery/contact_form";
import ProjectAvatar from "../../assets/icon/challenge.png";
import Tags from "../../components/pages/tags";
import Video from "../../components/gallery/video";
import {
  FileTextOutlined,
  LinkOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import VoteForm from "./voteform";
import { getOneFieldData } from "../../utils/helper";
import { inclusivityJudges, finalJudges } from "../../constants";
import Judges from "../admin/gallery/judges";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      numPages: 0,
      pageNumber: 1,
      showModal: false,
      showVoteModal: false,
      curVote: {},
      scoreModal: false,
    };
  }

  componentDidMount = async () => {
    const { getGallery, getPublicParticipant, match } = this.props;
    this.setState({ loading: true });
    let curGallery = await getGallery(match.params.id);
    await getPublicParticipant(curGallery.project);
    this.setState({ loading: false });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  setPageNumber = (num) => {
    this.setState({ pageNumber: num });
  };

  previousPage = () => {
    const { pageNumber } = this.state;
    if (pageNumber <= 1) return;
    this.setState({ pageNumber: pageNumber - 1 });
  };

  nextPage = () => {
    const { pageNumber, numPages } = this.state;
    if (pageNumber >= numPages) return;
    this.setState({ pageNumber: pageNumber + 1 });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  openProjectContact = () => {
    this.setState({
      showModal: true,
    });
  };

  contactGallery = (values) => {
    const gallery = this.props.gallery.currentGallery;
    values.gallery = gallery.name;
    values.id = gallery.project;
    this.props.contactProjectCreator(values);
    this.closeModal();
  };

  openModal = () => {
    const { user } = this.props;
    const gallery = this.props.gallery.currentGallery;
    let curVote = {
      gallery: gallery._id,
      participant: user._id,
    };
    for (let pv of gallery.pvs) {
      if (pv.participant && pv.participant._id === user._id) {
        curVote = Object.assign({}, pv);
        curVote.participant = user._id;
      }
    }
    this.setState({ showVoteModal: true, curVote });
  };

  hideModal = () => {
    this.setState({ showVoteModal: false, curVote: {} });
  };

  toggleScoreModal = () => {
    this.setState({ scoreModal: !this.state.scoreModal });
  };

  calculateAverageScore = (gal) => {
    let judgeitems =
      gal.challenge &&
      gal.challenge.challenge_name.toLowerCase().includes("inclusivity")
        ? inclusivityJudges
        : finalJudges;
    let sum = 0,
      num = 0;
    for (let pv of gal.pvs) {
      for (let item of judgeitems) {
        for (let child of item.items) {
          sum += pv[child.field] || 0;
          num++;
        }
      }
    }
    if (sum > 0) {
      return parseInt((100 * sum) / num) / 100;
    }
    return 0;
  };

  render = () => {
    const { loading } = this.state;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && (
            <div className="user-dashboard list-view">
              {this.renderGalleryInfo()}
              {this.renderMedia()}
              {this.renderModal()}
            </div>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderGalleryInfo = () => {
    const gallery = this.props.gallery.currentGallery;
    const {
      fieldData,
      label,
      isJudge,
      createProjectVote,
      updateProjectVote,
      getGallery,
    } = this.props;
    const { showVoteModal, curVote, scoreModal } = this.state;
    const challengeKind =
      gallery.challenge &&
      gallery.challenge.challenge_name.toLowerCase().includes("inclusivity")
        ? "inclusivity"
        : "justice";
    const showGallery = !!getOneFieldData(fieldData, "show_gallery");
    const showGalleryScore = !!getOneFieldData(fieldData, "show_gallery_score");
    const rate =
      gallery.pvs && gallery.pvs.length > 0
        ? this.calculateAverageScore(gallery)
        : 0;

    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={gallery.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
          <div className="mt-3 flex" style={{ justifyContent: "center" }}>
            <Button type="primary" onClick={this.openProjectContact}>
              Contact the {label.project} team
            </Button>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <div className="gallery-title">
            <h3>{gallery.name}</h3>
            {showGalleryScore && (
              <Tooltip title="View Scores">
                <Button
                  className="test"
                  type="link"
                  onClick={this.toggleScoreModal}
                >
                  Score: {rate}
                </Button>
              </Tooltip>
            )}
            {isJudge && !showGallery && (
              <Button type="primary" onClick={this.openModal}>
                JUDGE
              </Button>
            )}
          </div>
          <p>{gallery.short_description}</p> <br />
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: gallery.description }}
          />
          <Tags
            fieldData={fieldData}
            tags={gallery.tags || []}
            prefix={"gallery"}
          />
          {showVoteModal && (
            <Modal
              title={`Judge gallery - ${gallery.name}`}
              centered
              visible={showVoteModal}
              width={800}
              footer={null}
              onCancel={this.hideModal}
            >
              <VoteForm
                createProjectVote={createProjectVote}
                updateProjectVote={updateProjectVote}
                getGallery={getGallery}
                hideModal={this.hideModal}
                curVote={curVote}
                challenge_kind={challengeKind}
              />
            </Modal>
          )}
          {scoreModal && (
            <Modal
              title={`Gallery Score`}
              centered
              visible={scoreModal}
              width={800}
              footer={null}
              onCancel={this.toggleScoreModal}
            >
              <Judges gallery={gallery} />
            </Modal>
          )}
        </Col>
      </Row>
    );
  };

  renderModal = () => (
    <Modal
      title="Contact"
      visible={this.state.showModal}
      footer={null}
      onCancel={this.closeModal}
      width={700}
    >
      <ContactForm
        toggleModal={this.closeModal}
        onSubmit={this.contactGallery}
      />
    </Modal>
  );

  renderMedia = () => {
    const gallery = this.props.gallery.currentGallery;
    const { pageNumber, numPages } = this.state;
    return (
      <React.Fragment>
        {gallery.video && (
          <Row>
            <Col>
              <hr className="mb-4" />
              <Video url={gallery.video} />
            </Col>
          </Row>
        )}
        {gallery.file && (
          <Row>
            <Col>
              <hr />
              <h5>
                <FileTextOutlined /> Document
              </h5>
              <Document
                file={gallery.file}
                onLoadSuccess={this.onDocumentLoadSuccess}
                options={options}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    width={window.innerWidth < 768 ? 330 : 820}
                    className={"hide-page-pdf"}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ))}
                <Page
                  width={window.innerWidth < 768 ? 330 : 820}
                  pageNumber={pageNumber}
                />
                <span className="pdf-paginator">
                  <Link to="#" onClick={this.previousPage}>
                    <LeftOutlined />
                  </Link>
                  {pageNumber} of {numPages}
                  <Link to="#" onClick={this.nextPage}>
                    <RightOutlined />
                  </Link>
                  &nbsp; | &nbsp;
                  <a
                    href={`${gallery.file}#1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FullscreenOutlined />
                  </a>
                </span>
              </Document>
            </Col>
          </Row>
        )}
        {gallery.links && gallery.links.length > 0 && (
          <Row className="gallery-link">
            <Col>
              <hr />
              <h5>
                <LinkOutlined /> Links
              </h5>
              {gallery.links.map((link) => (
                <a
                  key={link.link}
                  className="mr-5"
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    gallery: state.gallery,
    project: state.project,
    isAdmin: state.user.isAdmin,
    isJudge: state.user.isJudge,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getGallery,
  getPublicParticipant,
  getProject,
  contactProjectCreator,
  privateGallery,
  createProjectVote,
  updateProjectVote,
})(Gallery);
