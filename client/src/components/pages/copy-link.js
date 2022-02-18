import React from "react";
import { message, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

class CopyLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitelink: "",
    };
  }

  onCopyLink = () => {
    navigator.clipboard.writeText(this.state.invitelink);
    message.success("Copied!");
  };

  componentDidMount = async () => {
    const { id } = this.props;
    const invitelink = `${window.location.protocol}//${window.location.host}/register?referer=${id}`;
    this.setState({ invitelink });
  };

  render = () => {
    return (
      <div style={{ width: "100%" }} className="mt-4">
        <span>Referral link</span>
        <br />
        <span style={{ color: "#01789D" }}>{this.state.invitelink}</span>
        <Button type="link" onClick={this.onCopyLink} title="Copy">
          <CopyOutlined />
        </Button>
      </div>
    );
  };
}

export default CopyLink;
