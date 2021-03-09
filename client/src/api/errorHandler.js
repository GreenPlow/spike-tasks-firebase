// TODO show the user a message that there was a problem!
// import at the app.js level
import axios from "axios";

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    handleAxiosError(error);
    return Promise.reject(error);
  }
);

// utility function (a. give me an axios reponse, b, call one of four functions)
export default function handleAxiosError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    const errorStatus = error.response.status;
    console.error("attempted api call: ", error.response.config.url);
    switch (errorStatus) {
      case 400:
        console.error("error bad request ", errorStatus);
        break;

      case 403:
        console.error("error access denied: ", errorStatus);
        break;

      case 500:
        console.error("internal server error: ", errorStatus);
        break;

      default:
        // generic catch all
        console.error("general error: ", errorStatus);
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    // Network failure

    console.error(
      "request was made, but no response was recieved",
      error.request
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", error.message);

    // Something bad happened and I don't know what it was
  }
}
