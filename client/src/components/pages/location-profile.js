import React from "react";
import { Descriptions } from "antd";

const LocationProfile = ({ location, isAdmin }) => {
  return (
    <div className="location-profile-box">
      <Descriptions className="mb-4">
        <Descriptions.Item label="Venue">{location.venue}</Descriptions.Item>
        <Descriptions.Item label="Organization">
          {location.organization}
        </Descriptions.Item>
        <Descriptions.Item label="Venue Country">
          {location.venue_country}
        </Descriptions.Item>
        <Descriptions.Item label="Venue City">
          {location.venue_city}
        </Descriptions.Item>
        <Descriptions.Item label="Venue Street">
          {location.venue_street}
        </Descriptions.Item>
        <Descriptions.Item label="Venue Zipcode">
          {location.venue_zip}
        </Descriptions.Item>
        {location.creator && location.creator.profile && (
          <Descriptions.Item label="Hoster">
            {location.creator.profile.first_name}{" "}
            {location.creator.profile.last_name}
          </Descriptions.Item>
        )}
      </Descriptions>
      {/* <div className="content-box">
        <div dangerouslySetInnerHTML={{ __html: location.content }} />
      </div> */}
      {isAdmin && (
        <React.Fragment>
          <p>
            <span className="profile-label">
              Did your Organization Host the GLH 2019?
            </span>
            <span>{location.hosted_2019}</span>
          </p>
          <p>
            <span className="profile-label">
              Does the proposed venue have ample access to electrical outlets
              and high quality internet connections?
            </span>
            <span>{location.have_condition}</span>
          </p>
          <p>
            <span className="profile-label">
              How many participants can the proposed venue host?
            </span>
            <span>{location.participants_number}</span>
          </p>
          <p>
            <span className="profile-label">
              Do you have help to organize, ie. volunteers, team members, other
              committed parties?
            </span>
            <span>{location.have_help}</span>
          </p>
          <p>
            <span className="profile-label">
              Have you helped to organize a hackathon before?
            </span>
            <span>{location.before_helped}</span>
          </p>
          <p>
            <span className="profile-label">
              Will your proposed host organization be able to support food and
              beverage supplies for hackathon participants at your venue, or
              will you need additional sponsorship?
            </span>
            <span>{location.support_food}</span>
          </p>
          <p>
            <span className="profile-label">
              Does your organization want to host in Multiple Cities?(If marked
              yes, please fill out an application for each location you want to
              host at.)
            </span>
            <span>{location.multi_city}</span>
          </p>
        </React.Fragment>
      )}

      <a
        href={`/locations/${location._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4"
      >
        Goto Location Page
      </a>
    </div>
  );
};

export default LocationProfile;
