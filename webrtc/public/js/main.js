window.onload = function() {

    const socket = io()
    const video = document.getElementById('video')
    let isThisMyOffer = false

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
      const offer = await rtcPeerConnection.createOffer( { offerToReceiveAudio: true, offerToReceiveVideo: true })
      console.log(offer)
      rtcPeerConnection.setLocalDescription(offer)
      socket.emit('offer', offer)
      isThisMyOffer = true
    }

    async function createAnswer() {
      try {

        const answer = await rtcPeerConnection.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        socket.emit('answer', answer)
      } catch (error) {
        console.error(error)
        console.log('Failed to create and answer and emit it!')
      }
    }

    getMedia({ audio: false, video: { height: 0, width: 0 }})

    // given we receive an offer 

  socket.on('offer', async function(offer){

      console.log('RECEIVED OFFER! CREATING AND EMITTING AN ANSWER')

      // set offer as remoteDescription

      await rtcPeerConnection.setRemoteDescription(offer)

      // create an answer and emit an answer event
      createAnswer()
    })


    // given we receive an answer
    socket.on('answer', async function(answer) {

      console.log('ANSWER RECIEVED. SETTING REMOTE DESCRIPTION')

      try {
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