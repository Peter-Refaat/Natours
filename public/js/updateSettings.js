/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8000/api/v1/users/updateMe",
      data: {
        name,
        email,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Data updated successfuly!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
