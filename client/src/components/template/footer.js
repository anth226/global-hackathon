import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <a
          href="https://integraledger.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="mr-3">POWERED BY</span>
          <img
            src={
              "https://assets-global.website-files.com/6051c309dd2feabba128601a/6051fb746c969854a8d229d9_Integra.svg"
            }
            alt=""
          />
        </a>
      </div>
    );
  }
}

export default Footer;
