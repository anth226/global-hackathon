import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Collapse, Button, Modal, Tag } from "antd";
import {
  createHelpDoc,
  updateHelpDoc,
  deleteHelpDoc,
} from "../../../actions/help";
import { SettingOutlined } from "@ant-design/icons";
import EditHelpDoc from "./edit_form";

const { Panel } = Collapse;

class HelpDoc extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      helpdoc: {},
      loading: false,
    };
  }

  genExtra = (hd) => (
    <SettingOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
        this.setState({
          visible: true,
          helpdoc: hd,
        });
      }}
    />
  );

  createNew = () => {
    this.setState({
      helpdoc: {},
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      helpdoc: {},
      visible: false,
    });
  };

  setLoading = (loading) => {
    this.setState({ loading });
  };

  renderDocHeader = (hd) => (
    <span>
      <span className="mr-5">{hd.title}</span>
      {hd.popular && <Tag color="green">popular</Tag>}
      <Tag color="blue">{hd.related}</Tag>
    </span>
  );

  render() {
    const {
      helpdocs,
      createHelpDoc,
      updateHelpDoc,
      deleteHelpDoc,
    } = this.props;
    const { helpdoc, visible, loading } = this.state;
    return (
      <div className="container">
        <Row>
          <Col className="flex">
            <h5 className="mr-auto mb-5">Help Documentation</h5>
          </Col>
        </Row>
        {!loading && (
          <Collapse accordion>
            {helpdocs.map((hd) => (
              <Panel
                header={this.renderDocHeader(hd)}
                key={hd.title}
                extra={this.genExtra(hd)}
              >
                <div
                  className="sun-editor-editable"
                  dangerouslySetInnerHTML={{ __html: hd.content }}
                />
              </Panel>
            ))}
          </Collapse>
        )}
        <Button type="primary" className="mt-5" onClick={this.createNew}>
          Add New
        </Button>
        {visible && (
          <Modal
            title={`${helpdoc._id ? "Update" : "Create"} Help Document`}
            visible={visible}
            width={600}
            footer={false}
            onCancel={this.hideModal}
          >
            <EditHelpDoc
              helpdoc={helpdoc}
              createHelpDoc={createHelpDoc}
              updateHelpDoc={updateHelpDoc}
              deleteHelpDoc={deleteHelpDoc}
              hideModal={this.hideModal}
              setLoading={this.setLoading}
              label={this.props.label}
            />
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { helpdocs: state.helpdoc.helpdocs, label: state.label };
}

export default connect(mapStateToProps, {
  createHelpDoc,
  updateHelpDoc,
  deleteHelpDoc,
})(HelpDoc);
