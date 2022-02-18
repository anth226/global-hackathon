import React from "react";
import { Button } from "antd";

const ChallengeIntro = ({ hideIntro, rule }) => (
  <React.Fragment>
    <div className="chl-intro-img" />
    <div className="chl-intro-body">
      <h2 className="mb-4">Challenge Submission Form</h2>
      <div
        className="sun-editor-editable mb-3"
        dangerouslySetInnerHTML={{ __html: rule }}
      />
      <Button type="primary" style={{ float: "right" }} onClick={hideIntro}>
        Continue
      </Button>
    </div>
  </React.Fragment>
);

export default ChallengeIntro;
