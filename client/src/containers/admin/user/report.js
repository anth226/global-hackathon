import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody } from "reactstrap";
import { listReports } from "../../../actions/admin";
import { resolveUserReport } from "../../../actions/user";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Checkbox } from "antd";
import sampleUrl from "../../../assets/img/user-avatar.png";

class Reports extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { listReports } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    await listReports();
    if (!this._isMounted) return;
    this.setState({ loading: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  resolveReport = async (rid) => {
    await this.props.resolveUserReport(rid)
    await this.props.listReports();
  }

  render() {
    const { admin } = this.props;
    const reports = admin.reports || [];
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
      ],
    };

    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || sampleUrl} alt="" />;
    };

    const authorNameFormatter = (cell, row) => {
      return <Link to={`/participant/${row.author_id}`}>{cell}</Link>;
    };

    const targetNameFormatter = (cell, row) => {
      return <Link to={`/participant/${row.target_id}`}>{cell}</Link>;
    };

    const resolveFormatter = (cell, row) => {
      return (
      <Checkbox onChange={() => this.resolveReport(row._id) } disabled={row.resolved} checked={row.resolved} >Resolve</Checkbox>
      );
    };

    const columns = [
      {
        dataField: "author_photo",
        text: "Reporter",
        formatter: photoFormatter,
      },
      {
        dataField: "author_name",
        text: "Reporter Name",
        formatter: authorNameFormatter
      },
      {
        dataField: "target_photo",
        text: "Target",
        formatter: photoFormatter,
      },
      {
        dataField: "target_name",
        text: "Target Name",
        formatter: targetNameFormatter
      },
      {
        dataField: "text",
        text: "Reason",
      },
      {
        dataField: "resolved",
        text: "Resolved",
        formatter: resolveFormatter
      },
    ];

    const rowClasses = (row, rowIndex) => {
      if (row.resolved) return null
      return "unresolved-report"
    }

    return (
      <div className="content-admin">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto">Reports</h5>
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
                  data={reports}
                  columns={columns}
                  search
                  exportCSV={{
                    onlyExportFiltered: true,
                    exportAll: false,
                    fileName: "project-user.csv",
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
                        rowClasses={rowClasses}
                      />
                    </React.Fragment>
                  )}
                </ToolkitProvider>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admin: state.admin };
}

export default connect(mapStateToProps, { listReports, resolveUserReport })(Reports);
