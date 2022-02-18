import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { listAdminProjectCreators } from "../../../actions/admin";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton } from "antd";
import sampleUrl from "../../../assets/img/user-avatar.png";

class Creators extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { admin, listAdminProjectCreators } = this.props;
    this._isMounted = true;
    if (!admin.creators || admin.creators.length === 0) {
      this.setState({ loading: true });
      await listAdminProjectCreators();
      if (!this._isMounted) return;
      this.setState({ loading: false });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { admin, label } = this.props;
    const creators = admin.creators || [];
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

    const photoFormatter = (cell, row) => {
      return <img className="table-photo" src={cell || sampleUrl} alt="" />;
    };

    const columns = [
      {
        dataField: "photo",
        text: "Photo",
        formatter: photoFormatter,
      },
      {
        dataField: "name",
        text: "Name",
      },
      {
        dataField: "email",
        text: "Email",
      },
      {
        dataField: "country",
        text: "Country",
      },
      {
        dataField: "location",
        text: "Location",
      },
      {
        dataField: "org",
        text: "Organization",
      },
      {
        dataField: "projectName",
        text: `${label.titleProject} Name`,
      },
    ];

    return (
      <div className="content-admin">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto">{label.titleProject} Creator</h5>
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
                  data={creators}
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
  return { admin: state.admin, label: state.label };
}

export default connect(mapStateToProps, { listAdminProjectCreators })(Creators);
