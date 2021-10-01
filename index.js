const express = require('express')
const path = require('path')

const apiRouter = require('./routes/api')

const ical = require('node-ical')

const app = express()
app.use(express.json())
// app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, './client/build'))) // There are relative links in index.html. Therefore, we define static link from where to take the files

app.use('/api', apiRouter)
// console.log(path.join(__dirname, './client/build', 'index.html'))
app.get('/test', (req, res) => res.sendFile(__dirname + '/test.html'))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build', 'index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening on ${port}`)
