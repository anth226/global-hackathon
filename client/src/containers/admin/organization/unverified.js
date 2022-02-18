import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { CheckOutlined } from "@ant-design/icons";
import { Skeleton, Button, Popconfirm } from "antd";
import {
  adminUnverifiedOrganizations,
  adminVerifyOrganization,
} from "../../../actions/admin";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import sampleUrl from "../../../assets/icon/challenge.png";

class OrgReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      organizations: [],
    };
  }

  componentDidMount = () => {
    this.loadUnverifiedOrganizations();
  };

  loadUnverifiedOrganizations = async () => {
    const { adminUnverifiedOrganizations } = this.props;
    this.setState({ loading: true });
    const organizations = await adminUnverifiedOrganizations();
    this.setState({ loading: false, organizations });
  };

  verifyOrganization = async (orgid) => {
    await this.props.adminVerifyOrganization(orgid);
    this.loadUnverifiedOrganizations();
  };

  render() {
    const { label } = this.props;
    const { loading, organizations } = this.state;
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
        <div className="flex admin-action">
          <Popconfirm
            title="Are you sure verify this organization?"
            onConfirm={() => this.verifyOrganization(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" title="Verify">
              <CheckOutlined />
            </Button>
          </Popconfirm>
        </div>
      );
    };

    const columns = [
      {
        dataField: "logo",
        text: "Photo",
        formatter: photoFormatter,
      },
      {
        dataField: "org_name",
        text: `${label.titleOrganization} Name`,
      },
      {
        dataField: "authorized_email",
        text: "Authorized Email",
      },
      {
        dataField: "_id",
        text: "ID",
      },
      {
        dataField: "contact_email",
        text: "Contact Email",
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
              <h5 className="mr-auto">Unverified {label.titleOrganization}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Skeleton active loading={loading} />
              <Card>
                <CardBody>
                  <ToolkitProvider
                    bootstrap4
                    keyField="id"
                    data={organizations}
                    columns={columns}
                    search
                    exportCSV={{
                      onlyExportFiltered: true,
                      exportAll: false,
                      fileName: "org-report.csv",
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
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { organization: state.organization, label: state.label };
}

export default connect(mapStateToProps, {
  adminUnverifiedOrganizations,
  adminVerifyOrganization,
})(OrgReport);
