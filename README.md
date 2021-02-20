# RapidIdentity JavaScript SDK

> Open Source SDK to simplify building custom applications for [RapidIdentity](https://www.identityautomation.com/iam-platform/).

[RapidIdentity](https://www.identityautomation.com/iam-platform/) is an Identity and Access Management platform by [Identity Automation](https://www.identityautomation.com).

Use this SDK to simplify the process of creating custom integrations. Both cloud and on-premises deployments are supported.

## Getting started

### Pre-requisites

You must have RapidIdentity deployed and accessible to clients via `https`.

### Installation

This SDK can be installed in client or server (node.js) using npm or yarn.

```shell
npm install @34fame/ridjs
```

To use the SDK simply import it into your project.

### Node.js

```
const rijs = require('@34fame/rijs')
```

### Client Framework

```
import rijs from '@34fame/rijs'
```

## Usage

### Config

Every calls requires a configuration object. This lets the SDK know where to find your instance.

```
const config = {
   host: 'acme.rapididentity.com',  // Only include host or ip address
   port: 443,                       // default: 443
   token: <access_token>            // Provided by `login` endpoint
}
```

### Login

Initiate user session with the login endpoint. It will return an access token that will be required in all future calls.

```
import rijs from '@34fame/rijs'

const login = async (username, password) => {
   try {
      const token = rijs.login(RICONFIG, username, password)
      if (!token) return false
      config.token = token
      // add additional token handler code
      return token
   } catch (err) {
      console.error('login error', err)
      return false
   }
}
```

### Logout

Closes user session.

```
import rijs from '@34fame/rijs'

const logout = async () => {
   try {
      await rijs.logout(config)
      // additional logout code
      return true
   } catch (err) {
      console.error('logout error', err)
      return false
   }
}
```

## Licensing

The code in this project is licensed under MIT license.
