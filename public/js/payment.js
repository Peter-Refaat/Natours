/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

export const bookTour = async (tourID) => {
  try {
    const res = await axios.get(
      `/api/v1/bookings/checkout-session/${tourID}`,
    );
    window.setTimeout(() => {
      window.location.assign(res.data.checkoutURL);
    }, 1500);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

