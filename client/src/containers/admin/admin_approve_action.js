import React from "react";
import { Button, Popconfirm } from "antd";
import { FormOutlined, CheckOutlined } from "@ant-design/icons";

const AdminAction = ({ onEdit, onApprove }) => (
  <div className="flex admin-action">
    <Button type="link" onClick={onEdit} title="Edit">
      <FormOutlined />
    </Button>
    <Popconfirm
      title="Are you sure approve this item?"
      onConfirm={onApprove}
      okText="Yes"
      cancelText="No"
    >
      <Button type="link" title="Approve">
        <CheckOutlined />
      </Button>
    </Popconfirm>
  </div>
);

export default AdminAction;
