window.onload = function() {

    const socket = io()
    const video = document.getElementById('video')
    const room = document.getElementById('input')
    const form = document.getElementById('form')


    form.addEventListener('submit', function(event) {

      event.preventDefault()

      if(!room.value) return


      socket.emit('join', room.value)

      getMedia({ audio: false, video: { height: 0, width: 0 }})

      
    })

    // get user media 

    function setVideoSource(mediaStram) {
      if ('srcObject' in video) {
          console.log('Browser supports srcObject')
          try {
            video.srcObject = mediaStram;
            console.log('Setting srcObject')
          } catch (err) {
            // Even if they do, they may only support MediaStream
            video.src = URL.createObjectURL(mediaStram);
            console.log('Browser supports srcObject but we need to fallback to createObjectUrl')
          }
        } else {
          console.log('Browser does not support srcObject. use createObjectUrl')
          video.src = URL.createObjectURL(mediaStram);
        }

        createOffer()
    }

    function getMedia (constraints) {
      navigator.mediaDevices.getUserMedia(constraints)
      .then(function(mediaStream) {
        setVideoSource(mediaStream)
      })
      .catch(function(err){
        console.log('Failed to get user media!')
        console.error(err)
      })
    }

    const rtcPeerConnection = new RTCPeerConnection()

    async function createOffer() {
      console.log('creating offer ...')
      const offer = await rtcPeerConnection.createOffer( { offerToReceiveAudio: true, offerToReceiveVideo: true })
      console.log('setting local description ... ')
      rtcPeerConnection.setLocalDescription(offer)
      socket.emit('offer', offer, room.value)
      isThisMyOffer = true
    }

    async function createAnswer() {
      try {
        console.log('creating answer ...')
        const answer = await rtcPeerConnection.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        console.log(' setting local description ... ')
        rtcPeerConnection.setLocalDescription(answer)
        socket.emit('answer', answer, room.value)
      } catch (error) {
        console.error(error)
        console.log('Failed to create and answer and emit it!')
      }
    }

    // given we receive an offer 

  socket.on('offer', async function(offer){

      console.log('received offer ...')

      // set offer as remoteDescription
      console.log('setting remote description ...')
      await rtcPeerConnection.setRemoteDescription(offer)

      // create an answer and emit an answer event
      createAnswer()
    })


    // given we receive an answer
    socket.on('answer', async function(answer) {

      console.log('received answer ... ')

      try {
        console.log('setting remote description ...')
        await rtcPeerConnection.setRemoteDescription(answer)
        
      } catch (error) {
        console.error(error)
        console.error('Failed to set remote description after receiving ANSWER')
      }
      console.log('------ LOCAL DESCRIPTION ---------')
      console.log(rtcPeerConnection.currentLocalDescription)
      console.log('------ REMOTE DESCRIPTION ---------')
      console.log(rtcPeerConnection.currentRemoteDescription)

    })

  }