

// 403, 400, 500, generic catch all
// utility function (a. give me an axios reponse, b, call one of four functions)

export default function handleAxiosError(error) {
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
        console.error("general error: ", errorStatus);
    }
  
    return errorStatus;
  }