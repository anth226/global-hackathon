import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { listOrgUserReport } from "../../../actions/organization";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton } from "antd";

class OrgUserReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { organization, listOrgUserReport } = this.props;
    if (
      !organization.adminOrganizations ||
      organization.adminOrganizations.length === 0
    ) {
      this.setState({ loading: true });
      await listOrgUserReport();
      this.setState({ loading: false });
    }
  };

  render() {
    const { organization, label } = this.props;
    const organizations = organization.adminOrganizations || [];
    const { loading } = this.state;

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

    const columns = [
      {
        dataField: "id",
        text: "ID",
      },
      {
        dataField: "name",
        text: `${label.titleOrganization} Name`,
      },
      {
        dataField: "authroized_email",
        text: "Authorized Email",
      },
      {
        dataField: "contact_email",
        text: "Contact Email",
      },
    ];

    return (
      <React.Fragment>
        <div className="content">
          <Row>
            <Col className="flex">
              <h5 className="mr-auto">{label.titleOrganization}</h5>
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

export default connect(mapStateToProps, { listOrgUserReport })(OrgUserReport);
