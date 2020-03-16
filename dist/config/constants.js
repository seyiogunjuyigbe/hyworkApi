"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAIL_USER = exports.MAIL_PASS = exports.MAIL_SENDER = exports.MAIL_SERVICE = exports.TWITTER_CONSUMER_SECRET = exports.TWITTER_CONSUMER_KEY = exports.FACEBOOK_APP_SECRET = exports.FACEBOOK_APP_ID = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.CLOUDINARY_FOLDER = exports.PROD_DB_URL = exports.TEST_DB_URL = exports.LOCAL_DB_URL = exports.MODE = exports.SITE_URL = exports.DEV_DB_URL = exports.SECRET_KEY = exports.PORT = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _process$env = process.env,
    PORT = _process$env.PORT,
    SECRET_KEY = _process$env.SECRET_KEY,
    DEV_DB_URL = _process$env.DEV_DB_URL,
    SITE_URL = _process$env.SITE_URL,
    MODE = _process$env.MODE,
    LOCAL_DB_URL = _process$env.LOCAL_DB_URL,
    TEST_DB_URL = _process$env.TEST_DB_URL,
    PROD_DB_URL = _process$env.PROD_DB_URL,
    CLOUDINARY_FOLDER = _process$env.CLOUDINARY_FOLDER,
    CLOUDINARY_CLOUD_NAME = _process$env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY = _process$env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET = _process$env.CLOUDINARY_API_SECRET,
    GOOGLE_CLIENT_ID = _process$env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET = _process$env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID = _process$env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET = _process$env.FACEBOOK_APP_SECRET,
    TWITTER_CONSUMER_KEY = _process$env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET = _process$env.TWITTER_CONSUMER_SECRET,
    MAIL_SERVICE = _process$env.MAIL_SERVICE,
    MAIL_SENDER = _process$env.MAIL_SENDER,
    MAIL_PASS = _process$env.MAIL_PASS,
    MAIL_USER = _process$env.MAIL_USER;
exports.MAIL_USER = MAIL_USER;
exports.MAIL_PASS = MAIL_PASS;
exports.MAIL_SENDER = MAIL_SENDER;
exports.MAIL_SERVICE = MAIL_SERVICE;
exports.TWITTER_CONSUMER_SECRET = TWITTER_CONSUMER_SECRET;
exports.TWITTER_CONSUMER_KEY = TWITTER_CONSUMER_KEY;
exports.FACEBOOK_APP_SECRET = FACEBOOK_APP_SECRET;
exports.FACEBOOK_APP_ID = FACEBOOK_APP_ID;
exports.GOOGLE_CLIENT_SECRET = GOOGLE_CLIENT_SECRET;
exports.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
exports.CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET;
exports.CLOUDINARY_API_KEY = CLOUDINARY_API_KEY;
exports.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_FOLDER = CLOUDINARY_FOLDER;
exports.PROD_DB_URL = PROD_DB_URL;
exports.TEST_DB_URL = TEST_DB_URL;
exports.LOCAL_DB_URL = LOCAL_DB_URL;
exports.MODE = MODE;
exports.SITE_URL = SITE_URL;
exports.DEV_DB_URL = DEV_DB_URL;
exports.SECRET_KEY = SECRET_KEY;
exports.PORT = PORT;