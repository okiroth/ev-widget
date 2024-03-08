const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/v2/NewCar/Ping",
    createProxyMiddleware({
      target: "https://production.detroittradingexchange.com",
      changeOrigin: true,
    })
  );
  app.use(
    "/api/v2/NewCar/Post",
    createProxyMiddleware({
      target: "https://production.detroittradingexchange.com",
      changeOrigin: true,
    })
  );
  app.use(
    "/autoweb-ping",
    createProxyMiddleware({
      target: "http://leadengine.services.staging.autobytel.com",
      changeOrigin: true,
      pathRewrite: {
        "^/autoweb-ping": "/leadengine/DropZone.asmx/Ping",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      logLevel: "debug",
    })
  );
  app.use(
    "/autoweb-post",
    createProxyMiddleware({
      target: "http://leadengine.services.staging.autobytel.com",
      changeOrigin: true,
      pathRewrite: {
        "^/autoweb-post": "/leadengine/DropZone.asmx",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      logLevel: "debug",
    })
  );
};
