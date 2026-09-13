import axios from "axios";

const paymobClient = axios.create({
  baseURL: "https://accept.paymob.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default async function createPaymentIntention({
  amount,
  tour,
  user,
  redirectionUrl,
}) {
  const integrationId = Number(process.env.PAYMOB_INTEGRATION_ID);
  if (!Number.isInteger(integrationId)) {
    const error = new Error(
      "PAYMOB_INTEGRATION_ID is missing or invalid. Add the test Payment Integration ID from Paymob.",
    );
    error.statusCode = 500;
    error.isOperational = true;
    throw error;
  }

  const [firstName, ...lastNameParts] = user.name.trim().split(/\s+/);
  const lastName = lastNameParts.join(" ") || firstName;

  try {
    const response = await paymobClient.post(
      "/v1/intention/",
      {
        amount: Math.round(amount * 100),
        currency: "EGP",
        payment_methods: [integrationId],
        items: [
          {
            name: tour.name,
            amount: Math.round(amount * 100),
            description: tour.description,
            quantity: 1,
          },
        ],
        billing_data: {
          apartment: "NA",
          first_name: firstName,
          last_name: lastName,
          street: "NA",
          building: "NA",
          phone_number: process.env.PAYMOB_TEST_PHONE || "01010101010",
          city: "Cairo",
          country: "EG",
          email: user.email,
          floor: "NA",
          state: "Cairo",
        },
        special_reference: `${tour.name}-${tour.id}-${user.id}-${Date.now()}`,
        redirection_url: redirectionUrl,
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
        },
      },
    );

    return {
      ...response.data,
      url: `https://eg.checkout.paymob.com/?publicKey=${encodeURIComponent(process.env.PAYMOB_PUBLIC_KEY)}&clientSecret=${encodeURIComponent(response.data.client_secret)}`,
    };
  } catch (error) {
    const responseData = error.response?.data;
    const providerMessage =
      responseData?.detail ||
      responseData?.message ||
      responseData?.error ||
      (responseData ? JSON.stringify(responseData) : null) ||
      error.message ||
      "Paymob payment intention failed";
    const providerError = new Error(`Paymob: ${providerMessage}`);
    providerError.statusCode = error.response?.status || 502;
    providerError.isOperational = true;
    throw providerError;
  }
}
