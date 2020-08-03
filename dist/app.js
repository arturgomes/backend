"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');

var _express = require('express'); var _express2 = _interopRequireDefault(_express);
// import session from 'express-session';
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _passport = require('passport'); var _passport2 = _interopRequireDefault(_passport);
var _youch = require('youch'); var _youch2 = _interopRequireDefault(_youch);
var _node = require('@sentry/node'); var Sentry = _interopRequireWildcard(_node);
require('express-async-errors');
var _expresshttpproxy = require('express-http-proxy'); var _expresshttpproxy2 = _interopRequireDefault(_expresshttpproxy);
var _cookiesession = require('cookie-session'); var _cookiesession2 = _interopRequireDefault(_cookiesession);
var _cookieparser = require('cookie-parser'); var _cookieparser2 = _interopRequireDefault(_cookieparser);
var _User = require('./app/models/User'); var _User2 = _interopRequireDefault(_User);

var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);
// import authRoutes from './authRoutes';
var _sentry = require('./config/sentry'); var _sentry2 = _interopRequireDefault(_sentry);
require('./config/passport-setup');
require('./database');
const permitidos = ['https://couponfeed.co','https://localhost:3001'];
class App {
  constructor() {
    this.server = _express2.default.call(void 0, );

    Sentry.init(_sentry2.default);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {

    // parse cookies
    this.server.use(_cookieparser2.default.call(void 0, ));
    this.server.use(
      _cookiesession2.default.call(void 0, {
        name: "session",
        keys: [process.env.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
      })
    );
    this.server.use('/proxy', _expresshttpproxy2.default.call(void 0, {
      pathRewrite: {
        '^/proxy/': '/'
      },
      target: 'https://api.couponfeed.co',
      secure: false
    }));
    this.server.use(_cors2.default.call(void 0, {
      origin: (origin, callback) => {
        if (permitidos.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      baseURL: 'https://api.couponfeed.co/proxy',
      credentials: true
    }));
    // this.server.use(
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
    this.server.use(_passport2.default.initialize());
    // deserialize cookie from the browser
    this.server.use(_passport2.default.session());
    // set up cors to allow us to accept requests from our client




    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(_express2.default.json());
    this.server.use(
      '/files',
      _express2.default.static(_path2.default.resolve('..', 'tmp', 'uploads'))
    );

  }

  routes() {
    this.server.use(_routes2.default);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // middleware de tratamento de exceções
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new (0, _youch2.default)(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json('Internal server error');
    });
  }
}

exports. default = new App().server;
