/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

const update = async (endpoint, data, successMessage) => {
  try {
    const res = await axios.patch(`/api/v1/users/${endpoint}`, data);

    if (res.data.status === "success") {
      showAlert("success", successMessage);
    }
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    showAlert("error", message);
  }
};

export const updateUserData = async (data) =>
  await update("updateMe", data, "Data updated successfully!");

export const updatePassword = async (data) =>
  await update("updateMyPassword", data, "Password changed successfully!");
