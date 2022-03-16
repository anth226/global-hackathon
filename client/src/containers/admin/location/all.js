import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import {
  adminListLocation,
  adminResolveLocation,
  adminDeclineLocation,
  listPendingLocation,
} from "../../../actions/location";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import { EyeOutlined } from "@ant-design/icons";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Modal, Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import LocationProfile from "../../../components/pages/location-profile";

class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      curLoc: {},
      approvedLocations: [],
      pendingLocations: [],
    };
  }

  componentDidMount = () => {
    this.reloadLocations();
  };

  showModal = (row) => {
    this.setState({
      visible: true,
      curLoc: row,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      curLoc: {},
    });
  };

  resolveLocation = async (id) => {
    await this.props.adminResolveLocation({ _id: id });
    this.hideModal();
    this.reloadLocations();
    this.props.listPendingLocation();
  };

  declineLocation = async (id) => {
    await this.props.adminDeclineLocation(id);
    this.hideModal();
    this.reloadLocations();
    this.props.listPendingLocation();
  };

  reloadLocations = async () => {
    const { adminListLocation } = this.props;
    this.setState({ loading: true });
    const locations = await adminListLocation();
    const approvedLocations = [],
      pendingLocations = [];
    if (locations && locations.length > 0) {
      for (let loc of locations) {
        loc.creatorName = loc.creator
          ? `${loc.creator.profile.first_name} ${loc.creator.profile.last_name}`
          : "";
        loc.creatorEmail = loc.creator ? loc.creator.email : "";
        if (loc.status === "pending") pendingLocations.push(loc);
        else if (loc.status === "approved") {
          approvedLocations.push(loc);
        }
      }
    }
    this.setState({ loading: false, approvedLocations, pendingLocations });
  };

  render() {
    const { loading, approvedLocations, pendingLocations, visible, curLoc } =
      this.state;
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

    const actionFormatter = (cell, row) => {
      return (
        <Link to="#" onClick={() => this.showModal(row)}>
          <EyeOutlined />
        </Link>
      );
    };

    const columns = [
      {
        dataField: "venue",
        text: "Venue",
      },
      {
        dataField: "organization",
        text: "Organization",
      },
      {
        dataField: "venue_city",
        text: "City",
      },
      {
        dataField: "venue_country",
        text: "Country",
      },
      {
        dataField: "venue_street",
        text: "Street",
      },
      {
        dataField: "creatorName",
        text: "Creator Name",
      },
      {
        dataField: "creatorEmail",
        text: "Contact Email",
      },
      {
        dataField: "participants_number",
        text: "Participant Counts",
      },
      {
        dataField: "",
        text: "Action",
        formatter: actionFormatter,
      },
    ];

    return (
      <div className="content-admin">
        <Row>
          <Col>
            <Skeleton active loading={loading} />
            {pendingLocations.length > 0 && (
              <React.Fragment>
                <h5 className="mr-auto mt-4">Pending Locations</h5>
                <Card className="mb-5" style={{ background: "#faf1f1" }}>
                  <CardBody>
                    <ToolkitProvider
                      bootstrap4
                      keyField="_id"
                      data={pendingLocations}
                      columns={columns}
                    >
                      {(props) => (
                        <BootstrapTable
                          {...props.baseProps}
                          bordered={false}
                          wrapperClasses={`table-responsive data-table-1 mb-1`}
                        />
                      )}
                    </ToolkitProvider>
                  </CardBody>
                </Card>
              </React.Fragment>
            )}
            <h5 className="mr-auto mt-4">Locations</h5>
            <Card>
              <CardBody>
                <ToolkitProvider
                  bootstrap4
                  keyField="_id"
                  data={approvedLocations}
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
            {visible && (
              <Modal
                title={"Location Profile"}
                visible={visible}
                width={900}
                footer={false}
                onCancel={this.hideModal}
              >
                <LocationProfile location={curLoc} isAdmin={true} />
                {curLoc.status === "pending" && (
                  <div className="flex">
                    <Popconfirm
                      title="Are you sure decline this location?"
                      onConfirm={() => this.declineLocation(curLoc._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="ghost" className="mr-4">
                        Decline
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      onClick={() => this.resolveLocation(curLoc._id)}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </Modal>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    admin: state.admin,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  adminListLocation,
  adminResolveLocation,
  adminDeclineLocation,
  listPendingLocation,
})(Locations);
