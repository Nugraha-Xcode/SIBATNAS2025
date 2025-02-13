import axios from "axios";
import environment from "src/config/environment";
export default axios.create({
  baseURL: environment.api,
  headers: {
    "Content-type": "application/json",
  },
});
