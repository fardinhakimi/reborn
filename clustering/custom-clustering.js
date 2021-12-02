const express = require('express')
const cluster = require('cluster')
const process = require('process')
const os = require('os')


// Each nodejs process has access to a threadpool with 4 threads by default. 
// We can modify this default number by changing the value of the UV_THREADPOOL_SIZE env variable. 
// Not all code in nodejs uses this threadpool. some of the functions that use are functions in crypto and fs modules.
process.env.UV_THREADPOOL_SIZE = 1


if(cluster.isPrimary) {
    console.log('Primary process')
    console.log('Forking ...')
    const numberOfCpus = os.cpus().length

    for(let i = 0; i <= numberOfCpus; i++) {
        cluster.fork()
    }

} else {

    console.log(`Worker with process id ${process.pid} started on ${os.hostname()}`)

    const app = express()

    app.get('/', (req, res) => {
        res.send('Home page')
    })
    app.get('/route1', (req, res) => {
        res.send('Route 1')
    })


    app.listen(4000)

}

