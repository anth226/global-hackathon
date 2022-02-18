import { API_URL, createNotification, errorMessage } from "./index";
import {
  FETCH_GALLERYLIST,
  SET_CURRENT_GALLERY,
  FETCH_GALLERY_SEARCH_LIST,
  FETCH_ADMIN_GALLERYLIST
} from "./types";
import Client from "./api";
import { message } from "antd";

//= ===============================
// Gallery actions
//= ===============================

export function createGallery(galData) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/gallery`, galData);
      dispatch({ type: SET_CURRENT_GALLERY, gallery: res.data.gallery });
    } catch (err) {
      createNotification("Create Gallery", errorMessage(err));
    }
  };
}

export function updateGallery(galData) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.put(`${API_URL}/gallery`, galData);
      dispatch({ type: SET_CURRENT_GALLERY, gallery: res.data.gallery });
    } catch (err) {
      createNotification("Update Gallery", errorMessage(err));
    }
  };
}

export function getGallery(gal_id) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(`${API_URL}/gallery/${gal_id}`);
      dispatch({ type: SET_CURRENT_GALLERY, gallery: res.data.gallery });
      return res.data.gallery || {};
    } catch (err) {
      console.log(err);
    }
  };
}

export function getProjectGallery(projectId) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(`${API_URL}/gallery/project/${projectId}`);
      dispatch({ type: SET_CURRENT_GALLERY, gallery: res.data.gallery });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listGallery(count, filters) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/gallery/list/${count}`, filters);
      dispatch({
        type: FETCH_GALLERYLIST,
        gallerys: res.data.gallerys,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteGallery(gal_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.delete(`${API_URL}/gallery/${gal_id}`);
    } catch (err) {
      createNotification("Delete Gallery", errorMessage(err));
    }
  };
}

export function setCurrentGallery(gal) {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_GALLERY, gallery: gal });
  };
}

export function searchGallerys(text) {
  return async (dispatch) => {
    if (text && text.length < 3) {
      createNotification(
        "Search Gallery",
        "Search text should be at least 3 in length"
      );
      return;
    }
    const client = Client();
    try {
      let res = await client.get(`${API_URL}/search/gallery/${text}`);
      dispatch({
        type: FETCH_GALLERY_SEARCH_LIST,
        gallerys: res.data.gallerys,
        searchTxt: text,
      });
    } catch (err) {
      createNotification("Search Gallery", errorMessage(err));
    }
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({
      type: FETCH_GALLERY_SEARCH_LIST,
      gallerys: [],
    });
  };
}

export function privateGallery(id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/gallery/private/${id}`);
      dispatch({ type: SET_CURRENT_GALLERY, gallery: res.data.gallery });
      message.success(
        "Gallery has been changed to private status successfully"
      );
    } catch (err) {
      createNotification("Update Gallery", errorMessage(err));
    }
  };
}

export function publicGallery(id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.post(`${API_URL}/gallery/public/${id}`);
      dispatch({ type: SET_CURRENT_GALLERY, gallery: res.data.gallery });
      message.success("Gallery has been changed to public status successfully");
    } catch (err) {
      createNotification("Update Gallery", errorMessage(err));
    }
  };
}

export function listAllGallerys() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/gallery/admin/list`);
      dispatch({
        type: FETCH_ADMIN_GALLERYLIST,
        gallerys: res.data.gallerys,
      });
    } catch (err) {
      createNotification("List admin gallery", errorMessage(err));
    }
  };
}
