import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { listProjectDetails, deleteProject } from "../../../actions/project";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Modal } from "antd";
import sampleUrl from "../../../assets/icon/challenge.png";
import AdminAction from "../admin_action";
import EditProject from "../../project/project-edit";

class ProjectReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      projid: "",
    };
  }

  showModal = (projid) => {
    this.setState({
      visible: true,
      projid,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      projid: "",
    });
  };

  componentDidMount = async () => {
    const { project, listProjectDetails } = this.props;
    if (!project.projectDetails || project.projectDetails.length === 0) {
      this.setState({ loading: true });
      await listProjectDetails();
      this.setState({ loading: false });
    }
  };

  deleteProject = async (id) => {
    await this.props.deleteProject(id);
    this.props.listProjectDetails();
  };

  render() {
    const { project, label } = this.props;
    const projects = project.projectDetails || [];
    const { loading, visible, projid } = this.state;

    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;
    const paginationOptions = {
      paginationSize: 10,
      pageStartIndex: 1,
      firstPageText: "First",
      prePageText: "Back",
      nextPageText: "Next",
      lastPageText: "Last",
      nextPageTitle: "First page",
      prePageTitle: "Pre page",
      firstPageTitle: "Next page",
      lastPageTitle: "Last page",
      showTotal: true,
      sizePerPageList: [
        {
          text: "5",
          value: 5,
        },
        {
          text: "10",
          value: 10,
        },
        {
          text: "20",
          value: 20,
        },
        {
          text: "100",
          value: 100,
        },
      ],
    };

    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || sampleUrl} alt="" />;
    };
    const adminFormatter = (cell, row) => {
      return (
        <AdminAction
          onEdit={() => this.showModal(row._id)}
          onDelete={() => this.deleteProject(row._id)}
        />
      );
    };

    const columns = [
      {
        dataField: "logo",
        text: "Photo",
        formatter: photoFormatter,
      },
      {
        dataField: "project_name",
        text: `${label.titleProject} Name`,
      },
      {
        dataField: "short_description",
        text: "Short Description",
      },
      {
        dataField: "project_creator",
        text: `${label.titleProject} Creator`,
      },
      {
        dataField: "challenge_name",
        text: `${label.titleChallenge} Name`,
      },
      {
        dataField: "country",
        text: "Country",
      },
      {
        dataField: "",
        text: "Action",
        formatter: adminFormatter,
      },
    ];

    return (
      <React.Fragment>
        <div className="content">
          <Row>
            <Col className="flex">
              <h5 className="mr-auto">{label.titleProject}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Skeleton active loading={loading} />
              <Card>
                <CardBody>
                  <ToolkitProvider
                    bootstrap4
                    keyField="_id"
                    data={projects}
                    columns={columns}
                    search
                    exportCSV={{
                      onlyExportFiltered: true,
                      exportAll: false,
                      fileName: "project-report.csv",
                    }}
                  >
                    {(props) => (
                      <React.Fragment>
                        <Row>
                          <Col className="flex">
                            <SearchBar {...props.searchProps} />
                          </Col>
                          <Col className="text-right">
                            <ExportCSVButton
                              {...props.csvProps}
                              className="btn btn-primary"
                            >
                              Export CSV
                            </ExportCSVButton>
                          </Col>
                        </Row>
                        <BootstrapTable
                          {...props.baseProps}
                          bordered={false}
                          wrapperClasses={`table-responsive data-table-1 mb-1`}
                          pagination={paginationFactory(paginationOptions)}
                        />
                      </React.Fragment>
                    )}
                  </ToolkitProvider>
                </CardBody>
              </Card>
              <Modal
                title={`${label.titleProject} Profile`}
                visible={visible}
                width={800}
                footer={false}
                onCancel={this.hideModal}
              >
                {projid && (
                  <EditProject id={projid} hideModal={this.hideModal} />
                )}
              </Modal>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { project: state.project, label: state.label };
}

export default connect(mapStateToProps, { listProjectDetails, deleteProject })(
  ProjectReport
);
