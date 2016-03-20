'use strict'

const Lab = require('lab')
const Code = require('code')
const pkg = require('../package.json')
const lab = exports.lab = Lab.script()
const Plugin = require('../lib/index')

let mockServer = {
  log: console.log
}

lab.experiment('Plugin - init', () => {
  lab.test('Correct attributes', (done) => {
    let attributes = Plugin.attributes
    Code.expect(attributes.name).to.be.equal(pkg.name)
    Code.expect(attributes.version).to.be.equal(pkg.version)
    Code.expect(attributes.multiple).to.be.true()
    done()
  })

  lab.test('No upload path', (done) => {
    Plugin(mockServer, {}, (err) => {
      Code.expect(err).to.be.instanceof(Error)
      Code.expect(err.message).to.be.equal('Must define a path to upload files')
      done()
    })
  })

  lab.test('Invalid upload path', (done) => {
    Plugin(mockServer, {upload: {path: './invalid/path'}}, (err) => {
      Code.expect(err).to.be.instanceof(Error)
      Code.expect(err.message).to.be.startWith(
        'Must define a valid accessible path to upload files - '
      )
      done()
    })
  })

  lab.test('Invalid upload path', (done) => {
    Plugin(mockServer, {upload: {path: './invalid/path'}}, (err) => {
      Code.expect(err).to.be.instanceof(Error)
      Code.expect(err.message).to.be.startWith(
        'Must define a valid accessible path to upload files - '
      )
      done()
    })
  })

  lab.test('Define route with default options', (done) => {
    mockServer.route = function (route) {
      const config = route.config
      const payload = config.payload
      Code.expect(route.method).to.be.equal('POST')
      Code.expect(route.path).to.be.equal('/files')
      Code.expect(config.tags).to.not.exist()
      Code.expect(config.auth).to.be.false()
      Code.expect(payload.output).to.be.equal('stream')
      Code.expect(payload.parse).to.be.true()
      Code.expect(payload.allow).to.be.equal('multipart/form-data')
      Code.expect(payload.maxBytes).to.not.exist()
      Code.expect(config.pre).to.be.instanceof(Array)
      Code.expect(config.pre).to.have.length(1)
      Code.expect(config.pre[0].assign).to.be.equal('file')
      Code.expect(config.validate.query).to.not.exist()
      Code.expect(config.validate.params).to.not.exist()
      Code.expect(config.validate.headers).to.not.exist()
      Code.expect(config.validate.auth).to.not.exist()
      Code.expect(config.validate.payload).to.exist()
      Code.expect(config.validate.payload.isJoi).to.be.true()
      Code.expect(config.description).to.be.equal('Uploads a file')
    }
    Plugin(mockServer, {upload: {path: './'}}, (err) => {
      Code.expect(err).to.not.exist()
      done()
    })
  })
})
