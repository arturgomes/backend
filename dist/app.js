"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _passport = _interopRequireDefault(require("passport"));

var _youch = _interopRequireDefault(require("youch"));

var Sentry = _interopRequireWildcard(require("@sentry/node"));

require("express-async-errors");

var _expressHttpProxy = _interopRequireDefault(require("express-http-proxy"));

var _cookieSession = _interopRequireDefault(require("cookie-session"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _User = _interopRequireDefault(require("./app/models/User"));

var _routes = _interopRequireDefault(require("./routes"));

var _sentry = _interopRequireDefault(require("./config/sentry"));

require("./config/passport-setup");

require("./database");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import session from 'express-session';
// import authRoutes from './authRoutes';
class App {
  constructor() {
    this.server = (0, _express.default)();
    Sentry.init(_sentry.default);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // parse cookies
    this.server.use((0, _cookieParser.default)());
    this.server.use((0, _cookieSession.default)({
      name: "session",
      keys: [process.env.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 100
    }));
    this.server.use('/proxy', (0, _expressHttpProxy.default)({
      pathRewrite: {
        '^/proxy/': '/'
      },
      target: 'https://api.couponfeed.co',
      secure: false
    }));
    this.server.use((0, _cors.default)({
      origin: ['https://couponfeed.co', 'https://localhost:3001'],
      baseURL: 'https://api.couponfeed.co/proxy',
      credentials: true
    })); // this.server.use(
    // cors(
    //   {
    //     origin: "https://couponfeed.co", // allow to server to accept request from different origin
    //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //     credentials: true // allow session cookie from browser to pass through
    //   }
    // )
    // (req,res,next) =>{
    //   // res.header("Access-Control-Allow-Origin","http://localhost:3001/");
    //   // res.header("Access-Control-Allow-Headers",
    //   // "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    //   // console.log(res.headers);
    //   // if(req.method === 'OPTIONS'){
    //   //   res.header('Access-Control-Allow-Credentials','true');
    //   //   res.header('Access-Control-Allow-Methods', "PUT, POST, PATCH, DELETE, GET");
    //   //   return res.status(200).json({});
    //   // }
    // console.log(req.headers)
    // res.header('Access-Control-Allow-Credentials', 'true');
    // if(req.method === 'OPTIONS'){
    //     res.header('Access-Control-Allow-Origin', '*');
    //     // res.header('Access-Control-Allow-Origin', 'https://couponfeed.co');
    //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    //     res.header('Access-Control-Expose-Headers','Access-Control-Allow-Origin');
    //     // #
    //     // # Custom headers and headers various browsers *should* be OK with but aren't
    //     // #
    //     res.header('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
    //     // #
    //     // # Tell client that this pre-flight info is valid for 20 days
    //     // #
    //     res.header('Access-Control-Max-Age', 1728000);
    //     res.header('Content-Type', 'text/plain; charset=utf-8');
    //     res.header('Content-Length', 0);
    // }
    // next();
    // }
    // );
    // initalize passport

    this.server.use(_passport.default.initialize()); // deserialize cookie from the browser

    this.server.use(_passport.default.session()); // set up cors to allow us to accept requests from our client

    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(_express.default.json());
    this.server.use('/files', _express.default.static(_path.default.resolve('..', 'tmp', 'uploads')));
  }

  routes() {
    this.server.use((req, res, next) => {
      console.log('request received');
      console.log(req.headers);
      next();
    });
    this.server.use(_routes.default);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // middleware de tratamento de exceções
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new _youch.default(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json('Internal server error');
    });
  }

}

var _default = new App().server;
exports.default = _default;