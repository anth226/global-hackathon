import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Header, Footer } from "../../components/template";
import { Skeleton, Button } from "antd";
import { getPublicParticipant } from "../../actions/project";
import ProjectAvatar from "../../assets/icon/challenge.png";
import Tags from "../../components/pages/tags";
import Video from "../../components/gallery/video";
import {
  FileTextOutlined,
  LinkOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

class Gallery extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      numPages: 0,
      pageNumber: 1,
    };
  }

  componentDidMount = async () => {
    const { gallery, getPublicParticipant } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    await getPublicParticipant(gallery.currentGallery.project);
    if (!this._isMounted) return;
    this.setState({ loading: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

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

  render = () => {
    const { loading } = this.state;
    const { label } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          <Skeleton active loading={loading} />
          {!loading && (
            <div className="user-dashboard list-view">
              <div style={{ width: "100%", textAlign: "center" }}>
                <h2>{label.titleGallery} Preview</h2>
              </div>
              <Row>
                <Col>
                  <Button
                    type="primary"
                    className="mb-3"
                    style={{ float: "right" }}
                    onClick={this.props.togglePreview}
                  >
                    <RollbackOutlined /> Back to {label.titleProject}
                  </Button>
                </Col>
              </Row>
              {this.renderGalleryInfo()}
              {this.renderMedia()}
            </div>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  };

  renderGalleryInfo = () => {
    const gallery = this.props.gallery.currentGallery;
    const { fieldData } = this.props;
    return (
      <Row>
        <Col xl={4} md={5} className="mb-3">
          <div className="project-card">
            <div className="avatar-img">
              <img src={gallery.logo || ProjectAvatar} alt="logo" />
            </div>
          </div>
        </Col>
        <Col xl={8} md={7}>
          <h3>{gallery.name}</h3>
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
        </Col>
      </Row>
    );
  };

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
    gallery: state.gallery,
    project: state.project,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
};

export default connect(mapStateToProps, {
  getPublicParticipant,
})(Gallery);
