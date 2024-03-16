require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const {MongoClient} =require('mongodb');
const dns = require('dns')
const urlparser = require('url')


const client = new MongoClient('mongodb+srv://puree14885:<password>@cluster0.gbphcyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
const db = client.db("urlshortner")
const urls = db.collection("urls")


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



const originUrls =[]
const shortUrls = []

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  
  console.log(req.body)
  const url = req.body.url
  // const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
  //   if (!address){
  //     res.json({error: "Invalid URL"})
  //   } else {

  //     const urlCount = await urls.countDocuments({})
  //     const urlDoc = {
  //       url,
  //       short_url: urlCount
  //     }

  //     const result = await urls.insertOne(urlDoc)
  //     console.log(result);
  //     res.json({ original_url: url, short_url: urlCount })
      
  //   }
  // })

  const foundIndex = originUrls.indexOf(url)

  if(!url.includes("https://")&&!url.includes("http://")){
    return res.json({error: 'invalid url'})
  }

  if(foundIndex<0){
    originUrls.push(url)
    shortUrls.push(shortUrls.length)
    return res.json({
      original_url:url,
      short_url:shortUrls.length-1
    })
  }
  return res.json({
    original_url:url,
      short_url:shortUrls[foundIndex]
  })

});

app.get("/api/shorturl/:short_url", async (req, res) => {
  // const shorturl = req.params.short_url
  // const urlDoc = await urls.findOne({ short_url: +shorturl })
  // res.redirect(urlDoc.url)

  const shorturl =req.params.shorturl
  const foundIndex = shortUrls.indexOf(shorturl)

  if(foundIndex<0){
    return res.json({
      "error":"No short URL"
    })
  }
  res.redirect(originUrls[foundIndex])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
