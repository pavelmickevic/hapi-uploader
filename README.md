# hapi-file-uploader
Hapi plugin allowing easy and configurable file uploads

# Introduction

Creating a simple route to allow file uploads is pure madness. This plugin allows to register multiple configurable routes, with validation included, that make the burden of file uploading like a walk in the park.

# Example

```javascript
const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({ port: 8080 })

server.register({
  register: require('hapi-file-uploader'),
  options: {
    upload: {path: './'}
  }
}, (err) => {
  if (err) {
    console.log('Failed loading plugin', err)
    process.exit(1)
  }
  server.start((err) => {
    if (err) {
      console.log('Failed to start the server', err)
      process.exit(1)
    }
    console.log('Server running on - ' + server.info.port)
  })
})
```

# API

# Contributing

This project uses [standard js](https://github.com/feross/standard).

# License

MIT
