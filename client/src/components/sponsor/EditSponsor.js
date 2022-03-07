import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateSponsors as updateSponsorsAction } from "../../actions/sponsor";
import SponserForm from "./SponserForm";

const EditSponsor = ({ updateSponsorsAction, rowData, hideModal, refetch }) => {
  const [name, setName] = useState(rowData.name);
  const [origin, setOrigin] = useState(rowData.origin);
  const [id, setId] = useState(rowData.id);

  useEffect(() => {
    setName(rowData.name);
    setOrigin(rowData.origin);
    setId(rowData.id);
  }, [rowData]);

  const save = async () => {
    await updateSponsorsAction(id, { name, origin });
    refetch();
    hideModal();
  };
  return (
    <>
      {rowData && (
        <SponserForm
          setName={setName}
          setOrigin={setOrigin}
          setId={setId}
          save={save}
          name={name}
          origin={origin}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ sponsor }) => ({ sponsor });

export default connect(mapStateToProps, {
  updateSponsorsAction,
})(EditSponsor);
