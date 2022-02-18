import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Input, Skeleton, Popconfirm, Button } from "antd";
import { sendJudgeInvite } from "../../../actions/judge";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import JudgeChallenge from "./judge-challenge";
import { DeleteOutlined } from "@ant-design/icons";
import sampleUrl from "../../../assets/img/user-avatar.png";
import { listAdminJudges, deleteJudge } from "../../../actions/admin";
import { adminListChallenge } from "../../../actions/challenge";

class JudgePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { listAdminJudges, adminListChallenge } = this.props;
    this.setState({ loading: true });
    await listAdminJudges();
    await adminListChallenge();
    this.setState({ loading: false });
  };

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  sendInvitation = async () => {
    const { email } = this.state;
    if (!email) return;
    await this.props.sendJudgeInvite(email);
    this.setState({ email: "" });
  };

  deleteParticipant(userid) {
    this.props.deleteJudge(userid);
  }

  render() {
    const { email, loading } = this.state;
    const { admin, isSuper, label } = this.props;
    const participants = admin.participants || [];
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
      return <JudgeChallenge cell={cell} row={row} />;
    };

    const adminFormatter = (cell, row) => {
      return (
        <Popconfirm
          title="Are you sure delete this judge?"
          onConfirm={() => this.deleteParticipant(row._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" style={{ color: "red" }} title="Delete">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
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
        dataField: "org_name",
        text: label.titleOrganization,
      },
      {
        dataField: "phone",
        text: "Phone",
      },
      {
        dataField: "country",
        text: "Country",
      },
      {
        dataField: "integra_id",
        text: "Challenge",
        formatter: roleFormatter,
      },
      {
        dataField: "",
        text: "Action",
        formatter: adminFormatter,
      },
    ];

    return (
      <div className="content">
        <Skeleton active loading={loading} />
        <div className="account-form-box" style={{ maxWidth: "500px" }}>
          <h5 className="mb-5">
            <b>Send an invitation to a Judge</b>
          </h5>
          <span className="form-label">Email*</span>
          <Input
            size="large"
            type="email"
            onChange={this.onChangeEmail}
            value={email}
          />
          <button onClick={this.sendInvitation} className="hk_button mt-4">
            Send
          </button>
        </div>
        <Card className="mt-5">
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    user: state.user,
    isSuper: state.user.isSuper,
    label: state.label,
    admin: state.admin,
  };
}

export default connect(mapStateToProps, {
  sendJudgeInvite,
  listAdminJudges,
  deleteJudge,
  adminListChallenge,
})(JudgePage);
