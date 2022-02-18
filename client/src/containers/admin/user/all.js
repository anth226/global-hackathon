import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import {
  listAdminParticipants,
  deleteParticipant,
} from "../../../actions/admin";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Modal } from "antd";
import sampleUrl from "../../../assets/img/user-avatar.png";
import ColumnRole from "./column_role";
import AdminAction from "../admin_action";
import UserProfile from "./user-edit";

class Participants extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      userid: "",
    };
  }

  showModal = (userid) => {
    this.setState({
      visible: true,
      userid,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      userid: "",
    });
  };

  componentDidMount = async () => {
    const { listAdminParticipants } = this.props;
    this._isMounted = true;
    this.setState({ loading: true });
    await listAdminParticipants();
    if (!this._isMounted) return;
    this.setState({ loading: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  deleteParticipant(userid) {
    this.props.deleteParticipant(userid);
  }

  render() {
    const { admin, isSuper, label } = this.props;
    const participants = admin.participants || [];
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

    const roleFormatter = (cell, row) => {
      if (!isSuper) return cell;
      return <ColumnRole cell={cell} row={row} />;
    };

    const adminFormatter = (cell, row) => {
      return (
        <AdminAction
          onEdit={() => this.showModal(row._id)}
          onDelete={() => this.deleteParticipant(row._id)}
        />
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
        dataField: "role",
        text: "Site Role",
        formatter: roleFormatter,
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
        dataField: "verified",
        text: "Verified",
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
            <h5 className="mr-auto">All {label.titleParticipant}</h5>
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
            <Modal
              title={`${label.titleParticipant} Profile`}
              visible={this.state.visible}
              width={800}
              footer={false}
              onCancel={this.hideModal}
            >
              {this.state.userid && (
                <UserProfile
                  id={this.state.userid}
                  hideModal={this.hideModal}
                />
              )}
            </Modal>
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
  listAdminParticipants,
  deleteParticipant,
})(Participants);
