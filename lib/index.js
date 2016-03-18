const pkg = require('../package.json')
const Validation = require('./helpers/validation')
const Uploader = require('./uploader')

function fileUploader (server, options, next) {
  options = options || {}
  const routeOptions = options.route || {}
  const uploadOptions = options.upload || {}
  const path = routeOptions.path || '/files'
  const tags = routeOptions.tags
  const auth = routeOptions.auth || false
  const maxBytes = uploadOptions.maxBytes
  const validate = Validation(routeOptions.validate)
  const upload = Uploader(uploadOptions)

  server.route({
    method: 'POST',
    path,
    config: {
      tags,
      auth,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes
      },
      validate,
      // TODO allow pre and pos upload methods
      pre: [{
        method: (request, reply) => upload(request.payload, reply), assign: 'file'
      }],
      handler: function (request, reply) {
        reply(request.pre.file)
      },
      description: 'Uploads a file'
    }
  })
  next()
}

fileUploader.attributes = {
  name: pkg.name,
  version: pkg.version,
  multiple: true
}

module.exports = fileUploader
