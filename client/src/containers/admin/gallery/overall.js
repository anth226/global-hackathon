import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { listAllGallerys } from "../../../actions/gallery";
import { Skeleton, Collapse, Button, Modal, Switch, Tooltip } from "antd";
import ProjectAvatar from "../../../assets/icon/challenge.png";
import Tags from "../../../components/pages/tags";
import { inclusivityJudges, finalJudges } from "../../../constants";
import Judges from "./judges";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import { updateFieldData } from "../../../actions/profile";
import { getOneFieldData } from "../../../utils/helper";

const { Panel } = Collapse;

class AdminOverallGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      curGallery: {},
    };
  }

  showModal = (e, gallery) => {
    e.stopPropagation();
    this.setState({
      visible: true,
      curGallery: gallery,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      curGallery: {},
    });
  };

  componentDidMount = async () => {
    const { gallery, listAllGallerys } = this.props;
    if (!gallery.adminGallerys || gallery.adminGallerys.length === 0) {
      this.setState({ loading: true });
      await listAllGallerys();
      this.setState({ loading: false });
    }
  };

  renderGalleryInfo = (gallery) => {
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
          <div className="gallery-title">
            <h3>{gallery.name} </h3>
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
        </Col>
      </Row>
    );
  };

  genExtra = (gallery) => (
    <Tooltip title="View Scores">
      <Button
        className="test"
        type="link"
        onClick={(e) => this.showModal(e, gallery)}
      >
        Score: {gallery.score}
      </Button>
    </Tooltip>
  );

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

  sortByScore = (a, b) => {
    if (a.score > b.score) return -1;
    return 0;
  };

  onChangeShowGallery = (checked) => {
    this.props.updateFieldData({
      field: "show_gallery",
      value: checked ? "true" : "",
    });
  };

  onChangeShowGalleryScore = (checked) => {
    this.props.updateFieldData({
      field: "show_gallery_score",
      value: checked ? "true" : "",
    });
  };

  convertCSVData = (gallerys) => {
    let result = [],
      k = 0;
    for (let gal of gallerys) {
      const project = gal.project ? gal.project.name : gal.name;
      let judgeitems =
        gal.challenge &&
        gal.challenge.challenge_name.toLowerCase().includes("inclusivity")
          ? inclusivityJudges
          : finalJudges;
      let sum = 0,
        num = 0,
        judger = "";
      for (let pv of gal.pvs) {
        judger = pv.participant
          ? `${pv.participant.profile.first_name} ${pv.participant.profile.last_name}`
          : "";
        for (let item of judgeitems) {
          for (let child of item.items) {
            k++;
            let temp = {
              id: k,
              project,
              judger,
              question: child.question,
              score: pv[child.field] || 0,
            };
            result.push(temp);
            sum += pv[child.field] || 0;
            num++;
          }
        }
        k++;
        let temp = {
          id: k,
          project,
          judger,
          question: "Comment",
          score: pv.comment,
        };
        result.push(temp);
      }
      if (sum > 0) {
        k++;
        let temp = {
          id: k,
          project,
          judger: "",
          question: "Total Score",
          score: parseInt((100 * sum) / num) / 100,
        };
        result.push(temp);
      }
    }
    return result;
  };

  render() {
    const gallerys = this.props.gallery.adminGallerys || [];
    const { loading, visible, curGallery } = this.state;
    let incGallerys = [],
      justGallerys = [];
    for (let gal of gallerys) {
      gal.score = this.calculateAverageScore(gal);
      if (
        gal.challenge &&
        gal.challenge.challenge_name.toLowerCase().includes("inclusivity")
      ) {
        incGallerys.push(gal);
      } else {
        justGallerys.push(gal);
      }
    }
    incGallerys = incGallerys.sort(this.sortByScore);
    justGallerys = justGallerys.sort(this.sortByScore);
    const { ExportCSVButton } = CSVExport;
    const columns = [
      {
        dataField: "project",
        text: "Project Name",
      },
      {
        dataField: "judger",
        text: `Judge Name`,
      },
      {
        dataField: "question",
        text: `Question`,
      },
      {
        dataField: "score",
        text: `Score`,
      },
    ];

    return (
      <React.Fragment>
        <div className="content">
          <Row className="mb-4">
            <Col className="flex">
              <h5 className="mr-auto">
                <b>Overal Galleries</b>
              </h5>
            </Col>
          </Row>
          <ToolkitProvider
            bootstrap4
            keyField="id"
            data={this.convertCSVData(gallerys)}
            columns={columns}
            search
            exportCSV={{
              onlyExportFiltered: true,
              exportAll: false,
              fileName: "gallery-judges.csv",
            }}
          >
            {(props) => (
              <React.Fragment>
                <Row className="mb-5">
                  <Col
                    className="flex"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <span>
                        <Switch
                          defaultChecked={
                            !!getOneFieldData(
                              this.props.fieldData,
                              "show_gallery"
                            )
                          }
                          onChange={this.onChangeShowGallery}
                        />
                        <span className="ml-3">Make Gallery Public</span>
                      </span>
                      <span className="ml-5">
                        <Switch
                          defaultChecked={
                            !!getOneFieldData(
                              this.props.fieldData,
                              "show_gallery_score"
                            )
                          }
                          onChange={this.onChangeShowGalleryScore}
                        />
                        <span className="ml-3">Show Scores on Gallery</span>
                      </span>
                    </span>
                    <ExportCSVButton
                      {...props.csvProps}
                      className="btn btn-primary"
                    >
                      Export Results
                    </ExportCSVButton>
                  </Col>
                </Row>
                <BootstrapTable
                  {...props.baseProps}
                  bordered={false}
                  wrapperClasses="hidden-table"
                />
              </React.Fragment>
            )}
          </ToolkitProvider>
          <Row>
            <Col>
              <Skeleton active loading={loading} />
              <p>
                <b>1. Inclusivity Challenge</b>
              </p>
              <Collapse accordion>
                {incGallerys.map((gal) => (
                  <Panel
                    header={gal.name}
                    key={gal._id}
                    extra={this.genExtra(gal)}
                  >
                    {this.renderGalleryInfo(gal)}
                  </Panel>
                ))}
              </Collapse>
              <p className="mt-5">
                <b>2. Access to Justice / Business of Law</b>
              </p>
              <Collapse accordion>
                {justGallerys.map((gal) => (
                  <Panel
                    header={gal.name}
                    key={gal._id}
                    extra={this.genExtra(gal)}
                  >
                    {this.renderGalleryInfo(gal)}
                  </Panel>
                ))}
              </Collapse>
            </Col>
          </Row>
          {visible && (
            <Modal
              title={"Gallery Judges"}
              visible={visible}
              width={800}
              footer={false}
              onCancel={this.hideModal}
            >
              <Judges gallery={curGallery} isadmin={true} />
            </Modal>
          )}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { gallery: state.gallery, fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, {
  listAllGallerys,
  updateFieldData,
})(AdminOverallGallery);
