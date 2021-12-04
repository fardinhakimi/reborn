window.onload = function() {

    const socket = io()
    const video = document.getElementById('video')
    const remoteVideo = document.getElementById('remote')
    const room = document.getElementById('input')
    const form = document.getElementById('form')
    let localStream = null
    let isCaller = false

    const rtcPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    })

    form.addEventListener('submit', function(event) {

      event.preventDefault()

      if(!room.value) return

      socket.emit('join', room.value)
      
    })

    // get user media 

    function setVideoSource(mediaStram, video) {
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
    }


    function setLocalStream(mediaStream){
      console.log('setting local stream to: ', mediaStream)
      localStream = mediaStream
    }

    async function initUserMedia(constraints) {

      try {

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

        setLocalStream(mediaStream)
        setVideoSource(mediaStream, video)
        streamToRemotePeer(mediaStream)

      } catch (error) {
        console.log('Failed to get user media!')
        console.error(err)
      }
    }

    async function createOffer() {
      console.log('creating offer ...')
      const offer = await rtcPeerConnection.createOffer( { offerToReceiveAudio: true, offerToReceiveVideo: true })
      console.log('setting local description ... ')
      rtcPeerConnection.setLocalDescription(offer)
      socket.emit('offer', offer, room.value)
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

    rtcPeerConnection.onicecandidate = function (event) {
      if (event.candidate) {
        sendCandidateToRemotePeer(event.candidate)
      }
    }

    function sendCandidateToRemotePeer(candidate){
      socket.emit('iceCandidate', candidate, room.value)
    }
  
    function addRemoteIceCandidate(candidate){
      console.log('received remote ice candidate. adding it to the peer connection.')
      return rtcPeerConnection.addIceCandidate(candidate)
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

    socket.on('created', async function(created) {
      try {

        await initUserMedia({ audio: false, video: { height: 0, width: 0 }})

        // whoever creates the channel is set as the caller
        isCaller = created
  
        // if we are the joiner then we emit an event that we are ready to start exchanging offer/answer and ice candidates
        if(!isCaller) {
          console.log('joined room. ready to receive an offer!')
          socket.emit('ready', room.value)
        } else {
          console.log('room created. waiting for a joiner to join and declare that they are ready to receive an offer!')
        }
        
      } catch (error) {
        console.error(error) 
      }
    })

    // Joiner declares that he is ready. time to exchange offer/answer
    socket.on('ready', function() {
      console.log('joiner is ready for the offer/answer exchange ...')
      createOffer()
    })

    socket.on('iceCandidate', async function(candidate){

      console.log(candidate)

      try {

        await addRemoteIceCandidate(candidate)

      } catch (error) {
        console.error('failed to add remote ice candidate')
      }

    })

    rtcPeerConnection.onconnectionstatechange = function() {
      console.log('peer connection state has changed!')
      console.log('current peer connection state: ', rtcPeerConnection.connectionState)
      if(rtcPeerConnection.connectionState === 'connected'){
        console.log('Yes!!! the peers are connected!')
      }
    }

    function streamToRemotePeer(){
      console.log('streaming to remote peer')
      localStream.getTracks().forEach(function(track){
        console.log('streaming track: ', track)
        rtcPeerConnection.addTrack(track, localStream)
      })
    }

    // listen for incoming video/audio tracks coming from the remote peer
    rtcPeerConnection.ontrack = function(event){
      console.log('received remote track ...')
      const [remoteStream] = event.streams
      setVideoSource(remoteStream, remoteVideo)
    }

  }