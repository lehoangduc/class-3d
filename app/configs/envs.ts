import _ from 'lodash'

export const ENVS = {
  env: process.env.NODE_ENV,
  siteName: process.env.SITE_NAME,
  secretKey: process.env.SECRET_KEY,

  baseUrl: '',
  apiUrl: process.env.API_URL,
  apiProjectViewerUrl: process.env.API_PROJECT_VIEWER_URL,

  http: {
    timeout: Number.parseInt(process.env.HTTP_TIMEOUT || '60000', 10),
  },

  auth: {
    cookieDomain: process.env.AUTH_COOKIE_DOMAIN || 'localhost',
    cookieName: process.env.AUTH_COOKIE_NAME || 'access_token',
    loginPath: process.env.AUTH_LOGIN_PATH || '/auth/login',
    logoutPath: process.env.AUTH_LOGOUT_PATH || '/auth/logout',
  },

  projectDisplayPath: process.env.PROJECT_DISPLAY_PATH || '/view',

  storage: {
    filePath: process.env.STORAGE_FILE_PATH || 'public/files',
    fileMaxSize: Number.parseInt(process.env.STORAGE_FILE_MAX_SIZE || '209715200', 10), // 200MB
  },
}

export const SHARED_ENVS = _.omit(ENVS, ['secretKey'])
