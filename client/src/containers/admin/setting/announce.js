import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
import {
  listAnnounces,
  createAnnounce,
  updateAnnounce,
} from "../../../actions/announce";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Skeleton, Button, Modal, Switch } from "antd";
import EditAnnounce from "./announce-edit";
import { FormOutlined, PlusCircleOutlined } from "@ant-design/icons";

class Announcement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      child: {},
    };
  }

  showModal = (e, child) => {
    e.preventDefault()
    this.setState({
      visible: true,
      child: child || {},
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      child: {},
    });
  };

  componentDidMount = async () => {
    const { announce, listAnnounces } = this.props;
    if (announce.announces.length === 0) {
      this.setState({ loading: true });
      await listAnnounces();
      this.setState({ loading: false });
    }
  };

  createAnnounce = async (anc) => {
    this.setState({ loading: true });
    await this.props.createAnnounce(anc);
    this.setState({ loading: false });
  }

  updateAnnounce = async (anc) => {
    this.setState({ loading: true });
    await this.props.updateAnnounce(anc);
    this.setState({ loading: false });
  }

  render() {
    const { announce } = this.props;
    const announces = announce.announces || [];
    const { loading, visible, child } = this.state;

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

    const activeFormatter = (cell, row) => {
      return (
        <Switch checked={cell} />
      )
    }

    const adminFormatter = (cell, row) => {
      return (
        <Button type="link" onClick={(e) => this.showModal(e, row)}>
          <FormOutlined />
        </Button>
      );
    };

    const columns = [
      {
        dataField: "name",
        text: "Name",
      },
      {
        dataField: "_id",
        text: "ID",
      },
      {
        dataField: "description",
        text: "Description",
      },
      {
        dataField: "link",
        text: "Link",
      },
      {
        dataField: "active",
        text: "Active",
        formatter: activeFormatter
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
              <h5 className="mr-auto">Announcement</h5>
              <Button
                size="large"
                type="primary"
                className="mb-3"
                onClick={(e) => this.showModal(e)}
              >
                <PlusCircleOutlined /> Add New Announcement
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Skeleton active loading={loading} />
              {!loading && (
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      bootstrap4
                      keyField="_id"
                      data={announces}
                      columns={columns}
                      search
                      exportCSV={{
                        onlyExportFiltered: true,
                        exportAll: false,
                        fileName: "announcement.csv",
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
              )}
              
              {visible && (
                <Modal
                  title={`${child._id ? "Update" : "Create"} Announcement`}
                  visible={visible}
                  width={600}
                  footer={false}
                  onCancel={this.hideModal}
                >
                  <EditAnnounce
                    createAnnounce={this.createAnnounce}
                    updateAnnounce={this.updateAnnounce}
                    announce={child}
                    hideModal={this.hideModal}
                  />
                </Modal>
              )}
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { announce: state.announce };
}

export default connect(mapStateToProps, {
  listAnnounces,
  createAnnounce,
  updateAnnounce,
})(Announcement);
