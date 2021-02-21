const axios = require('axios')

const axiosInstance = (props) => {
   const { host, port = 443, token } = props
   const baseURL = `https://${host}:${port}/api/rest`
   const instance = axios.create({
      baseURL,
      responseType: 'json',
      timeout: 1000,
   })
   if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
   }
   return instance
}

/**
 * Establish a RapidIdentity session with username and password
 * and receive an access token.
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} username - The user's RapidIdentity username
 * @param {string} password - The user's RapidIdentity password
 *
 * @returns {string} Returns an access token
 */
exports.login = async (config, username, password) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.post(`/sessions`, {
         username,
         password,
      })
      if (result.status === 200) {
         return result.data.session.token
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 *
 * @returns {boolean} Returns logout success
 */
exports.logout = async (config) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.delete(`/sessions`)
      if (result.status === 204) {
         return true
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 *
 * @returns {object} Returns the active RapidIdentity license
 */
exports.license = async (config) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.get(`/bootstrapInfo`)
      if (result.status === 200) {
         return result.data.licenseInfo
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 *
 * @returns {object} Returns the user's profile
 */
exports.userProfile = async (config) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.get(`/bootstrapInfo`)
      if (result.status === 200) {
         return result.data.sessionInfo.user
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 *
 * @returns {object} Returns the user's RapidIdentity roles
 */
exports.userRoles = async (config) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.get(`/bootstrapInfo`)
      if (result.status === 200) {
         return result.data.sessionInfo.roles
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 * @param {string} [criteria] - Search string (defaults to all users)
 *
 * @returns {object} Returns users matching criteria and that the user has
 *                   access to see.
 */
exports.users = async (config, criteria = '**&**') => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.get(`/users?search=simple&criteria=${criteria}`)
      if (result.status === 200) {
         return result.data
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 * @param {boolean} [useCache=false] - Read from RapidIdentity cache
 *
 * @returns {object} Returns user application objects
 */
exports.userApplications = async (config) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.get(`/apps/my/applications`)
      if (result.status === 200) {
         return result.data.applications
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}

exports.callApi = async (props) => {
   const { config, method, url, data } = props

   try {
      const instance = axiosInstance(config)
      const result = await instance({
         method,
         url,
         data,
      })
      console.log('result', result)
      if (result.status === 200) {
         return result.data.applications
      }
      return false
   } catch (err) {
      console.error(err.message)
      return false
   }
}
