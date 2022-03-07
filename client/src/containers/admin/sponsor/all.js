import React, { useState, useEffect } from "react";
import { Card, Modal } from "antd";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import { listSponsors as listSponsorsAction } from "../../../actions/sponsor";

import { Row, Col, CardBody } from "reactstrap";
import { connect } from "react-redux";
import AdminAction from "../admin_action";
import EditSponsor from "../../../components/sponsor/EditSponsor";
import AddSponsor from "../../../components/sponsor/AddSponsor";

const Sponsor = ({ listSponsorsAction, sponsor }) => {
  const [resultsData, setResultsData] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [rowData, setRowData] = useState({});
  const [status, setStatus] = useState("initial");
  const [addSponsorModalVisible, setAddSponsorModalVisible] = useState(false);

  const { SearchBar } = Search;

  useEffect(() => {
    if (status === "initial") {
      listSponsorsAction();
      setStatus("fetching");
    }
    if (sponsor.status === "clear") {
      setStatus("fetching");
      setResultsData([]);
    }

    if (sponsor.status === "success") {
      setStatus("success");
      setResultsData(sponsor.sponsors.data);
    }
  }, [sponsor]);

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

  const showModal = (row) => {
    setIsVisible(true);
    setRowData({
      id: row._id,
      name: row.name,
      origin: row.origin,
    });
  };
  const hideModal = () => {
    setIsVisible(false);
    setRowData({});
  };

  const hideAddSponsorModal = () => {
    setAddSponsorModalVisible(false);
  };

  const showAddSponsorModal = () => {
    setAddSponsorModalVisible(true);
  };

  const adminFormatter = (cell, row) => {
    return <AdminAction onEdit={() => showModal(row)} />;
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "origin",
      text: "Origin",
    },
    {
      dataField: "",
      text: "Action",
      formatter: adminFormatter,
    },
  ];

  const refetch = () => {
    setStatus("fetching");
    return listSponsorsAction();
  };
  return (
    <div className="content-admin">
      <Row>
        <Col>
          <h5>Sponsors</h5>
          <Card>
            {status === "success" && (
              <CardBody>
                <ToolkitProvider
                  bootstrap4
                  keyField="_id"
                  data={resultsData}
                  columns={columns}
                  search
                >
                  {(props) => (
                    <React.Fragment>
                      <Row>
                        <Col className="mb-2">
                          <SearchBar {...props.searchProps} />
                        </Col>
                        <Col className="mb-2">
                          <button
                            className="btn btn-primary"
                            onClick={showAddSponsorModal}
                          >
                            Add Sponsor
                          </button>
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
            )}
          </Card>
          <Modal
            title="Update Sponsor"
            visible={visible}
            width={800}
            footer={false}
            onCancel={hideModal}
          >
            {rowData && (
              <EditSponsor
                rowData={rowData}
                hideModal={hideModal}
                refetch={refetch}
              />
            )}
          </Modal>
          <Modal
            title="Add Sponsor"
            visible={addSponsorModalVisible}
            width={800}
            footer={false}
            onCancel={hideAddSponsorModal}
          >
            <AddSponsor hideModal={hideAddSponsorModal} refetch={refetch} />
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ sponsor }) => ({ sponsor });

export default connect(mapStateToProps, { listSponsorsAction })(Sponsor);
