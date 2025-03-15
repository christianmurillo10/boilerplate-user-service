export default {
  node_env: process.env.NODE_ENV || "development",
  app_name: "Boilerplate User Service",
  app_env: process.env.APP_ENV || "local",
  version: process.env.APP_VERSION || "v1.0.0",
  port: process.env.APP_PORT || "3000"
};