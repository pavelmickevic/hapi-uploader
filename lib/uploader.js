const Async = require('async')
const Boom = require('boom')
const Mime = require('mime')
const urlencode = require('urlencode')
const fs = require('fs')

function uploader (options) {
  const uploadPath = options.uploadPath
  const fileName = options.name

  return upload

  function upload (data, cb) {
    const files = []
    Async.each(Object.keys(data), (prop, cbAsync) => {
      if (data.hasOwnProperty(prop)) files.push(prop)
      cbAsync()
    },
    (err) => {
      if (err) {
        // TODO log error
        // log.error({err: err, kind: kind, files: files}, '[files] error assigning file keys')
        return cb(Boom.internal())
      }
      saveFiles(files, data, cb)
    })
  }

  function saveFiles (files, data, cb) {
    if (!files) return cb(Boom.badData())
    if (files.length === 1) return saveFile(data[files[0]], cb)
    Async.map(files, (file, cbAsync) => {
      saveFile(data[file], cbAsync)
    }, cb)
  }

  function saveFile (data, cb) {
    const mimeType = data.hapi.headers['content-type']
    const name = fileName || urlencode.decode(data.hapi.filename)
    const file = data
    const path = uploadPath + '/' + fileName
    const fileStream = fs.createWriteStream(path)
    const fileInfo = {
      mimeType,
      path,
      name,
      extension: Mime.extension(mimeType)
    }

    fileStream.on('error', function (err) {
      if (err && err.errno === 34) {
        // TODO log error
        // log.error('[file] issue with file path')
      }
      // TODO log error
      // log.error({err: err}, '[file] error uploading file')
      return cb(Boom.internal())
    })

    file.pipe(fileStream)

    file.on('end', function (err) {
      if (err) {
        // TODO log error
        // log.error({err: err}, '[file] error uploading file')
        return cb(Boom.badData(err))
      }
      return cb(null, fileInfo)
    })
  }
}

module.exports = uploader
