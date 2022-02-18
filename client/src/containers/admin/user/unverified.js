import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Skeleton, Button, Popconfirm } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import {
  adminUnverifiedParticipants,
  adminVerifyParticipant,
} from "../../../actions/admin";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import sampleUrl from "../../../assets/img/user-avatar.png";

class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      participants: [],
    };
  }

  componentDidMount = () => {
    this.loadUnverifiedParticipants();
  };

  loadUnverifiedParticipants = async () => {
    const { adminUnverifiedParticipants } = this.props;
    this.setState({ loading: true });
    const participants = await adminUnverifiedParticipants();
    this.setState({ loading: false, participants });
  };

  verifyParticipant = async (userid) => {
    await this.props.adminVerifyParticipant(userid);
    this.loadUnverifiedParticipants();
  };

  render() {
    const { label } = this.props;
    const { loading, participants } = this.state;
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
            title="Are you sure verify this participant?"
            onConfirm={() => this.verifyParticipant(row._id)}
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
        dataField: "",
        text: "Action",
        formatter: adminFormatter,
      },
    ];

    return (
      <div className="content-admin">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto">Unverified {label.titleParticipant}</h5>
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
                  data={participants}
                  columns={columns}
                  search
                  exportCSV={{
                    onlyExportFiltered: true,
                    exportAll: false,
                    fileName: "all-user.csv",
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
  return {
    admin: state.admin,
    isSuper: state.user.isSuper,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  adminUnverifiedParticipants,
  adminVerifyParticipant,
})(Participants);
