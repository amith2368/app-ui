const express = require('express')
const app = express()
const port = 5000

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.send({ message: 'Mock Server'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})