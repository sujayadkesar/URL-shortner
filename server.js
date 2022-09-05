const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

require('dotenv').config();
const cloudurl = process.env.clouddburl

mongoose.connect(cloudurl , {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/views'));

const port = process.env.PORT || 4545

app.listen(port , ()=>{
  console.log("server running.......");
})

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/' , (req, res) =>{
  res.redirect('/home');
})

app.get('/home', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
  flush();
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/home#borderthis')
})
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

async function flush(req, res) {
  await ShortUrl.remove();
}

// async function myFunction() {
//     /* Get the text field */
//     const shortUrlsss = await ShortUrl.find();
//     var copyText = shortUrlsss
//     console.log(copyText)

//         /* Select the text field */
//         copyText.select();
//         copyText.setSelectionRange(0, 99999); /* For mobile devices */
      
//          /* Copy the text inside the text field */
//         navigator.clipboard.writeText(copyText.value);
      
//         /* Alert the copied text */
//         alert("Copied the text: " + copyText.value);
// }

// // function outFunc() {
// //   var tooltip = document.getElementById("myTooltip");
// //   tooltip.innerHTML = "Copy to clipboard";
// // }