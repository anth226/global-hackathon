import React from "react";

const Mark = (props) => (
  <div className="mark-block text-center">
    <div className="org-logo mb-3">
      <img src={props.orgLogo} width="150px" height="100px" alt="" />
    </div>
    <div className="org-name mt-3">
      <h3>{props.orgName}</h3>
    </div>
  </div>
);

export default Mark;
