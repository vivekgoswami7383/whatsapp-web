import axios from "axios";

export const handleMessage = async ({ client_id, message }) => {
  const options = {
    method: "POST",
    url: "https://app.eztor.io/api/waHandlingResponse",
    headers: {
      "Content-Type": "application/json",
    },
    data: { id: client_id, message },
  };

  try {
    const response = await axios(options);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.message,
    };
  }
};
