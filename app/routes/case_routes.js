const express = require('express')

const passport = require('passport')

const Case = require('../models/case')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { comment: { title: '', text: 'foo' } } -> { comment: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /cases
router.get('/cases', requireToken, (req, res, next) => {
  Case.find()
    .then(cases => {
      // `cases` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return cases.map(case => case.toObject())
    })
    // respond with status 200 and JSON of the cases
    .then(cases => res.status(200).json({ cases: cases }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /cases/5a7db6c74d55bc51bdf39793
router.get('/cases/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Case.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "comment" JSON
    .then(case => res.status(200).json({ case: case.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /cases
router.post('/cases', requireToken, (req, res, next) => {
  // set owner of new comment to be current user
  req.body.case.owner = req.user.id
  const caseData = req.body.case
  caseData.username = req.user.username

  Case.create(req.body.case)
    // respond to succesful `create` with status 201 and JSON of new "comment"
    .then(comment => {
      res.status(201).json({ case: case.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /cases/5a7db6c74d55bc51bdf39793
router.patch('/cases/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.case.owner

  Case.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, comment)

      // pass the result of Mongoose's `.update` to the next `.then`
      return comment.updateOne(req.body.case)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /cases/5a7db6c74d55bc51bdf39793
router.delete('/cases/:id', requireToken, (req, res, next) => {
  Case.findById(req.params.id)
    .then(handle404)
    .then(case => {
      // throw an error if current user doesn't own `comment`
      requireOwnership(req, case)
      // delete the comment ONLY IF the above didn't throw
      case.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
