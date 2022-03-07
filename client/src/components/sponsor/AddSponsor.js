import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addSponsor as addSponsorAction } from "../../actions/sponsor";
import SponserForm from "./SponserForm";

const AddSponsor = ({ addSponsorAction, hideModal, refetch }) => {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");

  const save = async () => {
    await addSponsorAction({ name, origin });
    setName("");
    setOrigin("");
    refetch();
    hideModal();
  };
  return (
    <>
      <SponserForm
        setName={setName}
        setOrigin={setOrigin}
        save={save}
        name={name}
        origin={origin}
      />
    </>
  );
};

const mapStateToProps = ({ sponsor }) => ({ sponsor });

export default connect(mapStateToProps, {
  addSponsorAction,
})(AddSponsor);
