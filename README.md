# RapidIdentity JavaScript SDK

> Open Source SDK to simplify building custom applications for [RapidIdentity](https://www.identityautomation.com/iam-platform/).

[RapidIdentity](https://www.identityautomation.com/iam-platform/) is an Identity and Access Management platform by [Identity Automation](https://www.identityautomation.com).

Use this SDK to simplify the process of creating custom integrations. Both cloud and on-premises deployments are supported.

## Getting started

### Pre-requisites

You must have RapidIdentity deployed and accessible to clients via `https`.

### Installation

This SDK can be installed in client or server (node.js) using npm or yarn.

```bash
npm install @34fame/ridjs
```

### Node.js

Import the SDK in Node.js.

```js
const rijs = require('@34fame/rijs')
```

### Client Framework

Import the SDK in vanilla JavaScript or framework.

```js
import rijs from '@34fame/rijs'
```

## Usage

### Config

Every call requires a configuration object. This lets the SDK know where to find your instance.

```js
const config = {
   host: 'acme.rapididentity.com', // Only include host or ip address
   port: 443, // default: 443
   token: '<access_token>', // Provided by `login` endpoint
}
```

### Login

Initiate user session with the login endpoint. It will return an access token that will be required in all future calls.

```js
import rijs from '@34fame/rijs'

const login = async (username, password) => {
   try {
      const token = rijs.login(config, username, password)
      if (!token) return false
      config.token = token
      // other token handler code
      return token
   } catch (err) {
      console.error('login error', err)
      return false
   }
}
```

### Logout

Closes user session.

```js
import rijs from '@34fame/rijs'

const logout = async () => {
   try {
      await rijs.logout(config)
      return true
   } catch (err) {
      console.error('logout error', err)
      return false
   }
}
```

### License

Retrieve the active RapidIdentity license.

```js
rijs.license(config)
```

### User Profile

Retrieve the authenticated user's profile.

```js
rijs.userProfile(config)
```

### User Roles

Retrieve the authenticated user's RapidIdentity roles.

```js
rijs.userRoles(config)
```

### User Applications

Retrieve the authenticated user's RapidIdentity application objects.

```js
rijs.userApplications(config)
```

### Users

Retrieve list of users visible to the authenticated user.

```js
rijs.users(config)
```

## Licensing

The code in this project is licensed under MIT license.
