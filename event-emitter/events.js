
const EventEmitter = require('events')


const EventTypes = {
    FILE_UPLAODED: 'file_uploaded'
}

// class EventEmitter {

//     events = {}


//     constructor(events = {}) {
//         this.events = events
//     }


//     on(type, listener) {
//         this.events[type] = this.events[type] || []
//         this.events[type].push(listener)
//     }

//     emit(type, ...args) {
//         if(!this.events[type]) return
//         this.events[type].forEach(func => func(...args))
//     }
// }



const emitter = new EventEmitter()

emitter.on(EventTypes.FILE_UPLAODED, function name(payload) {
    console.log('file was uploaded')
    console.log('payload ', payload)
})

emitter.emit(EventTypes.FILE_UPLAODED, { name: 'file1'})

