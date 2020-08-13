const express = require("express");
const morgan = require('morgan')
const timeAgo = require('node-time-ago')
const postBank = require('./postBank')

const app = express();
app.use(morgan('dev'))
app.use(express.static('public'))


app.get('/posts/:id', (req, res, next) => {

  const post = postBank.find(req.params.id)

  // this will put out a new error for our error handler down below
  if (!post.id) {
    next(new Error(404))
  } else {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
        <header><img src="/logo.png"/>Wizard News</header>
          <div class='news-item'>
            <p>
              <h2>${post.title}</h2>
              <small>(by ${post.name})</small>
            </p>
            ${post.content}
          </div>
    </body>
  </html>
  `
  res.send(html)
  }
})

app.get('/posts', (req, res) => {
  const list = postBank.list()
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${list.map(post => `
          <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span>
              <a href="posts/${post.id}">${post.title}</a>
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${post.date}
            </small>
          </div>`
        ).join('')}
      </div>
    </body>
  </html>
  `
  res.send(html)
})

// this is waiting for a new Error object
app.use(function (err, req, res, next) {
  console.error(err.message)
  if (err.message === 404) {
    res.status(404).send('404 not found')
  } else {
    res.status(500).send('Internal server error')
  }
})

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
