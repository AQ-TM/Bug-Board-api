// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Project = require('../models/project')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

router.post('/projects/:id/issues', requireToken, (req, res, next) => {
  const issueData = req.body.issue
  issueData.username = req.user.username
  Project.findById(req.params.id)
    .then(handle404)
    .then(project => {
      project.issues.push({ issueData })
      return project.save()
    })
    .then(project => res.status(201).json({ project }))
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/issues/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Project.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(project => res.status(200).json({ project: project.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// Index comment
router.get('/projects/:id/view-issues', (req, res, next) => {
  const projectId = req.params.id
  Project.findById(projectId)
    .then(handle404)
    // .then(comments => {
    //   return comments.map(comment => comment.toObject())
    // })
    .then(project => res.status(200).json({ issues: project.issues.toObject() }))
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/issues/:id/', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.project.owner

  Project.findById(req.params.id)
    .then(handle404)
    .then(project => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, project)

      // pass the result of Mongoose's `.update` to the next `.then`
      return project.updateOne(req.body.project)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/issues/:id', requireToken, (req, res, next) => {
  Project.findById(req.params.id)
    .then(handle404)
    .then(project => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, project)
      // delete the example ONLY IF the above didn't throw
      project.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router