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
   } catch (error) {
      throw new Error(error)
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
   } catch (error) {
      throw new Error(error)
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
   } catch (error) {
      throw new Error(error)
   }
}

/**
 *
 * @param {object} config - RapidIdentity configuration object
 * @param {string} config.host - The RapidIdentity host
 * @param {string} [config.port=443] - The RapidIdentity HTTPS port
 * @param {string} config.token - The user access token
 *
 * @returns {object} Returns aggregated data for user from all authorized delegations
 */
exports.userData = async (config, userId) => {
   try {
      const instance = axiosInstance(config)
      const result = await instance.get(`/profiles/aggregated/for/${userId}`)
      if (result.status === 200) {
         let response = {}
         const delegations = result.data.aggregatedDelegation.delegationProfiles
         delegations.map((d) => {
            if (d.delegation.id !== 'other_profiles') return false
            d.profile.attributes.map((a) => {
               const galId = a.id
               const name = a.name.toLowerCase().replace(/\ /g, '_')
               const galDef = d.delegation.attributes.find(
                  (gal) => gal.galItem.id === galId
               )
               let value
               if (!galDef.galItem.allowMultiValue) {
                  value = a.values[0]
               } else {
                  value = a.values
               }
               response[name] = value
            })
         })
         return response
      }
      return false
   } catch (error) {
      throw new Error(error)
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
   } catch (error) {
      throw new Error(error)
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
   } catch (error) {
      throw new Error(error)
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
exports.users = async ({ config, criteria = '**&**', did = null }) => {
   try {
      const instance = axiosInstance(config)
      let url = `/users?search=simple&criteria=${criteria}`
      if (did) url += `&did=${did}`
      const result = await instance.get(url)
      if (result.status === 200) {
         return result.data
      }
      return false
   } catch (error) {
      throw new Error(error)
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
   } catch (error) {
      throw new Error(error)
   }
}

exports.callApi = async (props) => {
   const { config, method, url, data } = props
   let result
   try {
      const instance = axiosInstance(config)
      result = await instance({
         method,
         url,
         data,
      })
      if (result.status >= 200 && result.status <= 299) {
         return result.data
      }
      return false
   } catch (error) {
      throw new Error(error)
   }
}
