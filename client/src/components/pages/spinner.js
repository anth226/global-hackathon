import React from "react";
import { Spinner } from "reactstrap";
import { Modal } from "antd";

const GrowSpinner = () => (
  <div className="m-3">
    <Spinner type="grow" color="primary" />
    <Spinner type="grow" color="secondary" />
    <Spinner type="grow" color="success" />
    <Spinner type="grow" color="danger" />
    <Spinner type="grow" color="warning" />
    <Spinner type="grow" color="info" />
  </div>
);

export const ModalSpinner = ({visible}) => (
  <Modal
    title={null}
    visible={visible}
    width={300}
    footer={false}
    closable={false}
    centered
    className={"fileread-modal transparent"}
  >
    <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
  </Modal>
);

export default GrowSpinner
