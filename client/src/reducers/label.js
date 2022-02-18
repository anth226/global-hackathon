import { FETCH_LABEL } from "../actions/types";
import { toTitleText } from "../utils/helper";

const INITIAL_STATE = {
  _id: "",
  participant: "participant",
  organization: "organization",
  challenge: "challenge",
  project: "project",
  gallery: "gallery",
  review: "review",
  titleParticipant: "Participant",
  titleOrganization: "Organization",
  titleChallenge: "Challenge",
  titleProject: "Project",
  titleGallery: "Gallery",
  titleReview: "Review",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LABEL:
      const label = action.label;
      if (!label || !label._id) return { state };
      return {
        ...state,
        _id: label._id,
        participant: label.participant.toLowerCase(),
        organization: label.organization.toLowerCase(),
        challenge: label.challenge.toLowerCase(),
        project: label.project.toLowerCase(),
        gallery: label.gallery.toLowerCase(),
        review: label.review.toLowerCase(),
        titleParticipant: toTitleText(label.participant),
        titleOrganization: toTitleText(label.organization),
        titleChallenge: toTitleText(label.challenge),
        titleProject: toTitleText(label.project),
        titleGallery: toTitleText(label.gallery),
        titleReview: toTitleText(label.review),
      };
    default:
      return state;
  }
}
