import React from "react";
import { Header, Footer } from "../../components/template";

const LocationSubmit = () => {
  return (
    <React.Fragment>
      <Header />
      <div className="login-page">
        <h1 className="mt-3 mb-4">Thanks for your submit</h1>
        <p style={{ fontSize: "16px" }}>
          One of our admin manager will check your hosting location and will
          send you an email.
          <br />
          After we approve, you can host the location completely and get started
          your journey on our platform
        </p>
        <br />
        <hr />
        <p>
          If you haven't received any email within 24hr, please contact our
          support <a href="mailto:info@globallegalhackathon.com">here</a>.
        </p>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default LocationSubmit;
