const express = require('express')
const app = express()
const fs = require('fs')

const options = {
  cert: fs.readFileSync('./full_chain.pem'),
  key: fs.readFileSync('./private.key')
}


// 一定要把这一行代码，写到 静态资源托管之前
app.use(express.static('./dist')) // 托管静态目录



app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
  })

  
// https.createServer(options, app).listen(443)
