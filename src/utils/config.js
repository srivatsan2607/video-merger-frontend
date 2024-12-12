// dev config variables name
const local = {
  serverUrl: "http://localhost:5000",
};

// prod config variables name
const prod = {
  serverUrl: "http://localhost:5000",
};

const config = process.env.REACT_APP_STAGE === "production" ? prod : local;

// export the default configuration
export default {
  ...config,
};
