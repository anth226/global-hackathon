import React from "react";
import { Container } from "reactstrap";
import { Footer, Header } from "../../components/template";

export default function LocationDetails() {
  return (
    <React.Fragment>
      <div className="h-screen">
        <Header />
        <div className="py-5"></div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
