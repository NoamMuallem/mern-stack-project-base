import ErrorActionTypes from "../types/errorTypes";
import { IAction } from "../../types/interfaces";

const initialState = {
  msg: {},
  status: null,
  id: null,
};

export default function (state = initialState, action: IAction) {
  switch (action.type) {
    case ErrorActionTypes.GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id,
      };
    case ErrorActionTypes.CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null,
      };
    default:
      return state;
  }
}
