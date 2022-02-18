import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { Button, Modal, Popconfirm } from "antd";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
} from "../../../actions/resource";
import {
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import EditResourceForm from "./edit_form";

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

class ResourcePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      curesource: {},
      loading: false,
      numPages: 0,
      pageNumber: 1,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.props.listResource();
    this.setState({ loading: false });
  };

  showModal = (resource) => {
    this.setState({
      curesource: resource,
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      curesource: {},
      visible: false,
    });
  };

  createNew = () => {
    this.setState({
      curesource: { type: "link" },
      visible: true,
    });
  };

  onDeleteResource = async (id) => {
    this.setState({ loading: true });
    await this.props.deleteResource(id);
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

  renderResource = (resource, index) => (
    <div className="resource-block" key={index}>
      <div className="resource-header">
        <h5>{resource.title}</h5>
        <div>
          <Link
            to="#"
            onClick={() => this.showModal(resource)}
            title="Edit"
            className="mr-3"
          >
            <EditOutlined />
          </Link>
          <Popconfirm
            title="Are you sure delete this resource?"
            onConfirm={() => this.onDeleteResource(resource._id)}
            okText="Yes"
            cancelText="No"
          >
            <Link to="#" className="mr-3" title="Delete">
              <DeleteOutlined />
            </Link>
          </Popconfirm>
        </div>
      </div>
      <p>{resource.short_description}</p>
      {resource.type === "link" && (
        <a href={resource.link} target="_blank" rel="noopener noreferrer">
          visit here
        </a>
      )}
      {resource.type === "image" && (
        <div className="resource-img">
          <div>
            <img src={resource.link} alt="" />
          </div>
        </div>
      )}
      {resource.type === "pdf" && (
        <div className="resource-pdf">
          <Document
            file={resource.link}
            onLoadSuccess={this.onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(this.state.numPages), (el, index) => (
              <Page
                width={window.innerWidth < 768 ? 330 : 820}
                className={"hide-page-pdf"}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
            <Page
              width={window.innerWidth < 768 ? 330 : 820}
              pageNumber={this.state.pageNumber}
            />
            <span className="pdf-paginator">
              <Link to="#" onClick={this.previousPage}>
                <LeftOutlined />
              </Link>
              {this.state.pageNumber} of {this.state.numPages}
              <Link to="#" onClick={this.nextPage}>
                <RightOutlined />
              </Link>
              &nbsp; | &nbsp;
              <a
                href={`${resource.link}#1`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FullscreenOutlined />
              </a>
            </span>
          </Document>
        </div>
      )}
    </div>
  );

  render() {
    const { resources, createResource, updateResource } = this.props;
    const { curesource, visible, loading } = this.state;
    return (
      <div className="container">
        <Row>
          <Col className="flex">
            <h3 className="mr-auto mb-3">Resources</h3>
          </Col>
        </Row>
        {!loading &&
          resources.map((resource, i) => {
            return this.renderResource(resource, i);
          })}
        <Button type="primary" className="mt-5 mb-5" onClick={this.createNew}>
          Add New Resource
        </Button>
        {visible && (
          <Modal
            title={`${curesource._id ? "Update" : "Create"} Resource`}
            visible={visible}
            width={600}
            footer={false}
            onCancel={this.hideModal}
          >
            <EditResourceForm
              resource={curesource}
              createResource={createResource}
              updateResource={updateResource}
              hideModal={this.hideModal}
            />
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { resources: state.resource.resources };
}

export default connect(mapStateToProps, {
  listResource,
  createResource,
  updateResource,
  deleteResource,
})(ResourcePage);
