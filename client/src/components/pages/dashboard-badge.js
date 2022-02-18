import React from "react";
import GoldBadge from "../../assets/img/gold-badge.png";
import SilverBadge from "../../assets/img/silver-badge.png";

class DashboardBadge extends React.Component {
  render = () => {
    const { referred } = this.props;
    let badge = "",
      title = "";
    if (referred && referred >= 20) {
      badge = GoldBadge;
      title = "Global Ambassador";
    }
    if (referred && referred < 20 && referred > 4) {
      badge = SilverBadge;
      title = "Ambassador";
    }
    if (!badge) return null;
    return <img className="dashboard-badge" src={badge} title={title} alt="" />;
  };
}

export default DashboardBadge;
