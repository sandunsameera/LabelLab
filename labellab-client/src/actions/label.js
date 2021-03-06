import {
  POST_LABEL_FAILURE,
  POST_LABEL_REQUEST,
  POST_LABEL_SUCCESS,
  FETCH_LABEL_FAILURE,
  FETCH_LABEL_REQUEST,
  FETCH_LABEL_SUCCESS,
  CREATE_LABEL_FAILURE,
  CREATE_LABEL_REQUEST,
  CREATE_LABEL_SUCCESS,
  UPDATE_LABEL_FAILURE,
  UPDATE_LABEL_REQUEST,
  UPDATE_LABEL_SUCCESS,
  TOKEN_TYPE
} from "../constants/index";

import FetchApi from "../utils/FetchAPI";
import { getToken } from "../utils/token";

const token = getToken(TOKEN_TYPE);

export const fetchLabels = (project_id, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi("GET", "/api/v1/label/" + project_id + "/get", null, token)
      .then(res => {
        dispatch(success(res.data.body));
        callback();
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
                failure(err.response.data.msg, err.response.data.err_field)
              )
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };
  function request() {
    return { type: FETCH_LABEL_REQUEST };
  }
  function success(data) {
    return { type: FETCH_LABEL_SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: FETCH_LABEL_FAILURE, payload: error };
  }
};

export const createLabel = (data, callback) => {
  return dispatch => {
    dispatch(request());
    FetchApi(
      "POST",
      "/api/v1/label/" + data.project_id + "/create",
      { label: data },
      token
    )
      .then(res => {
        dispatch(success());
        callback();
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
                failure(err.response.data.msg, err.response.data.err_field)
              )
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };
  function request() {
    return { type: CREATE_LABEL_REQUEST };
  }
  function success() {
    return { type: CREATE_LABEL_SUCCESS };
  }
  function failure(error) {
    return { type: CREATE_LABEL_FAILURE, payload: error };
  }
};

export const updateLabels = (image_id, labelData) => {
  return dispatch => {
    dispatch(request());
    FetchApi("PUT", "/api/v1/image/" + image_id + "/update", labelData, token)
      .then(res => {
        dispatch(success());
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(
                failure(err.response.data.msg, err.response.data.err_field)
              )
            : dispatch(failure(err.response.statusText, null));
        }
      });
  };
  function request() {
    return { type: UPDATE_LABEL_REQUEST };
  }
  function success() {
    return { type: UPDATE_LABEL_SUCCESS };
  }
  function failure(error) {
    return { type: UPDATE_LABEL_FAILURE, payload: error };
  }
};
