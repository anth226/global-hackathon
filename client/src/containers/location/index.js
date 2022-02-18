import React, { useState } from "react";
import { Button } from "antd";
import LocationProfile from "../../components/pages/location-profile";
import LocationProfileForm from "./profile";

const LocationModal = ({ location, isAdmin, onNext }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <React.Fragment>
      {!isEdit && <LocationProfile location={location} isAdmin={isAdmin} />}
      {isEdit && <LocationProfileForm location={location} onNext={onNext} />}
      <div
        className="flex"
        style={{ justifyContent: "flex-end", width: "100%" }}
      >
        {isAdmin && !isEdit && (
          <Button className="mr-4" type="ghost" onClick={() => setIsEdit(true)}>
            Edit
          </Button>
        )}
        {!isEdit && (
          <Button type="primary" onClick={onNext}>
            Close
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};

export default LocationModal;
