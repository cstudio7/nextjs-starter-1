require('dotenv').config()
const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieSession = require('cookie-session')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()
    const httpServer = require('http').Server(server)

    server.use(compression())
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(bodyParser.json())
    server.use(
      cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })
    )

    // demo auth urls, not for production usage
    server.post('/api/login', (req, res) => {
      const { username, password } = req.body
      if (username === 'user@example.com' && password === 'changeme') {
        const user = {
          id: '12345',
          firstName: 'John',
          lastName: 'Doe',
          email: 'user@example.com',
        }
        req.session.user = user
        res.send(user)
      } else {
        res.status(401).send({
          error: 'Invalid user or password',
        })
      }
    })

    server.get('/api/logout', (req, res) => {
      req.session = null
      res.send(undefined)
    })

    server.get('/api/whoami', (req, res) => {
      res.send(req.session.user)
    })

    server.get('*', (req, res) => handle(req, res))

    httpServer.listen(port, (err) => {
      if (err) throw err
      console.log(`> Custom server ready on ${process.env.BASE_URL}`) // eslint-disable-line no-console
    })
  })
  .catch((ex) => {
    console.error(ex.stack) // eslint-disable-line no-console
    process.exit(1)
  })
