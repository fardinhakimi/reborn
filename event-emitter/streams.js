const fs = require('fs')
const zlib = require('zlib')



const readableStream = fs.createReadStream(__dirname + "/test.txt", {
    encoding: 'utf8'
})

const writeAbleStream = fs.createWriteStream('test2.txt')

//readableStream.on('data', chunk => writeAbleStream.write(chunk))

readableStream.pipe(writeAbleStream)

// Let's create a compressed version of this file. 

// zlib.createGzip() creates a transform aka Duplex stream
const gzip = zlib.createGzip()

readableStream.pipe(gzip).pipe(fs.createWriteStream('test2.txt.gz'))