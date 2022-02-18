import { API_URL, createNotification, errorMessage } from "./index";
import {
  FETCH_PROJECT_LIST,
  FETCH_PROJECT,
  FETCH_PROJECT_PARTICIPANTS,
  FETCH_PROJECT_SEARCH_LIST,
  FETCH_PROJECT_DETAIL_LIST,
  FETCH_REVIEW_PROJECT_LIST,
  CREAT_PROJECT_VOTE,
  UPDATE_PROJECT_VOTE,
} from "./types";
import axios from "axios";
import Client from "./api";
import { message } from "antd";

//= ===============================
// Project actions
//= ===============================
export function createProject(project) {
  return async (dispatch) => {
    try {
      let res = await axios.post(`${API_URL}/project`, project);
      return res.data.project;
    } catch (err) {
      createNotification("Create Project", errorMessage(err));
    }
  };
}

export function updateProject(project) {
  return async (dispatch) => {
    try {
      let res = await axios.put(`${API_URL}/project`, project);
      return res.data.project;
    } catch (err) {
      createNotification("Update Project", errorMessage(err));
    }
  };
}

export function listProjects(count, filters) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/project/list/${count}`, filters);
      dispatch({
        type: FETCH_PROJECT_LIST,
        projects: res.data.projects,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listReviewProjects(count, filters) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(
        `${API_URL}/project/review-list/${count}`,
        filters
      );
      dispatch({
        type: FETCH_REVIEW_PROJECT_LIST,
        projects: res.data.projects,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function upvoteProject(id, vote) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/project/upvote/${id}`, {
        vote,
      });
      return res.data.project;
    } catch (err) {
      createNotification("Upvote Project", errorMessage(err));
    }
  };
}

export function challengeProjects(challengeId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(`${API_URL}/project/challenge/${challengeId}`);
      return res.data.projects;
    } catch (err) {
      console.log(err);
    }
  };
}

export function getProject(projectId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(`${API_URL}/project/${projectId}`);
      dispatch({ type: FETCH_PROJECT, project: res.data.project });
      return res.data.project || {};
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteProject(projid) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.delete(`${API_URL}/project/${projid}`);
      return res.data.project || {};
    } catch (err) {
      createNotification("Delete Project", errorMessage(err));
    }
  };
}

export function getProjectsByUser(userId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(`${API_URL}/projectmember/project/${userId}`);
      return res.data.projects;
    } catch (err) {
      console.log(err);
    }
  };
}

export function getParticipant(projectId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(
        `${API_URL}/projectmember/participant/${projectId}`
      );
      dispatch({
        type: FETCH_PROJECT_PARTICIPANTS,
        participants: res.data.participants,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function getPublicParticipant(projectId) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(
        `${API_URL}/projectmember/pub-participant/${projectId}`
      );
      dispatch({
        type: FETCH_PROJECT_PARTICIPANTS,
        participants: res.data.participants,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function joinProject(projectId) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/projectmember/${projectId}`, {});
      message.success("You are following this project.");
      return res.data.projectmember;
    } catch (err) {
      createNotification("Follow Project", errorMessage(err));
    }
  };
}

export function leaveProject(projectId) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.delete(`${API_URL}/projectmember/${projectId}`);
      message.info("You are leaving this project.");
    } catch (err) {
      createNotification("Follow Project", errorMessage(err));
    }
  };
}

export function listProjectByCreator(participantId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(
        `${API_URL}/project/participant/${participantId}`
      );
      return res.data.projects;
    } catch (err) {
      console.log(err);
    }
  };
}

export function listProjectByOrgCreator(orgId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(`${API_URL}/project/organization/${orgId}`);
      return res.data.projects;
    } catch (err) {
      console.log(err);
    }
  };
}

export function searchProject(text) {
  return async (dispatch) => {
    if (text.length < 3) {
      createNotification(
        "Search Project",
        "Search text should be at least 3 in length"
      );
      return;
    }
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/search/project/${text}`);
      dispatch({
        type: FETCH_PROJECT_SEARCH_LIST,
        projects: res.data.projects,
        searchTxt: text,
      });
    } catch (err) {
      createNotification("Search Project", errorMessage(err));
    }
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_PROJECT_SEARCH_LIST, projects: [] });
  };
}

export function inviteProjectTeam(projectId, participantId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/projectmember/invite/${projectId}`, {
        participant: participantId,
      });
    } catch (err) {
      createNotification("Invite Project", errorMessage(err));
    }
  };
}

export function acceptInviteTeam(pmId, accept) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/projectmember/invite-accept/${pmId}`, {
        accept,
      });
    } catch (err) {
      createNotification("Accept Invitation project team", errorMessage(err));
    }
  };
}

export function cancelInviteProjectTeam(projectId, participantId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/projectmember/invite-cancel/${projectId}`, {
        participant: participantId,
      });
    } catch (err) {
      createNotification("Invite Project", errorMessage(err));
    }
  };
}

export function contactProjectCreator({ id, email, phone, gallery, message }) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/project/contact/${id}`, {
        email,
        phone,
        gallery,
        message,
      });
      createNotification(
        "Contact project",
        "Contact information submitted successfully"
      );
    } catch (err) {
      createNotification("Contact project", errorMessage(err));
    }
  };
}

export function listProjectDetails() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/project/admin/list`);
      dispatch({
        type: FETCH_PROJECT_DETAIL_LIST,
        projectDetails: res.data.projects,
      });
    } catch (err) {
      createNotification("List Project Details", errorMessage(err));
    }
  };
}

export function shareProject(sharers, id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      const res = await client.post(`${API_URL}/project/share/${id}`, {
        sharers,
      });
      message.success(
        "Project has been shared for this participants successfully"
      );
      return res.data.project;
    } catch (err) {
      createNotification("Share Project", errorMessage(err));
    }
  };
}

export function createProjectVote(projectVote) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/project-vote`, projectVote);
      dispatch({
        type: CREAT_PROJECT_VOTE,
        projectVote: res.data.projectvote,
      });
    } catch (err) {
      createNotification("Create Project Vote", errorMessage(err));
    }
  };
}

export function updateProjectVote(projectVote) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.put(`${API_URL}/project-vote`, projectVote);
      dispatch({
        type: UPDATE_PROJECT_VOTE,
        projectVote: res.data.projectvote,
      });
    } catch (err) {
      createNotification("Update Project Vote", errorMessage(err));
    }
  };
}
