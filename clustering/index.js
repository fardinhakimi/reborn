const express = require('express')

const app = express()

// pm2 is used to cluster this version of the app. 
// npm i pm2 -g 
// pm2 start index.js -i 0
// -i 0 let's pm2 to determine the most appropriate number of instances to create based on the hardware of 
// the computer. 


app.get('/', (req, res) => {
    res.send('Home page')
})


app.get('/route1', (req, res) => {
    res.send('Route 1')
})


app.listen(4000)



