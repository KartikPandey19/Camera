let constraints = { video: true, audio: true };
let videoPlayer = document.querySelector('video');
let audioPlayer = document.querySelector('audio');
let videoRecordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture'); 
let mediaRecorder;
let recordState = false;
let chunks = [];
videoRecordBtn.addEventListener("click", function () {
    if (mediaRecorder != undefined) {
        let innerDiv = videoRecordBtn.querySelector('#record-div');
        if (recordState == false) {
            recordState = true;
            innerDiv.classList.add('recording-animation');
            mediaRecorder.start();
        } else {
            recordState = false;
            innerDiv.classList.remove('recording-animation');
            mediaRecorder.stop();
        }
    }
})
navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        videoPlayer.srcObject=mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data)
        }
        mediaRecorder.onstop = function () {
            let blob = new Blob(chunks, { type: 'video/mp4' });
            chunks = [];
            let blobUrl = URL.createObjectURL(blob)
            var link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'video.mp4';
            link.click();
            link.remove();

        }
    })
    .catch(function (err) {
        console.log(err);
    })
  captureBtn.addEventListener('click',function(){
      let innerDiv = captureBtn.querySelector('#click-div');
      innerDiv.classList.add('capture-animation');
      capture();
      setTimeout(function(){
        innerDiv.classList.remove('capture-animation')
    },1000);
  })
  function capture(){ 
      let c = document.createElement('canvas');
      c.width = videoPlayer.videoWidth;
      c.height = videoPlayer.videoHeight;
      let tool = c.getContext('2d');
      tool.drawImage(videoPlayer,0,0);
      let link = document.createElement('a');
      link.download = 'image.jpg';
      link.href =c.toDataURL ();
       link.click();
       link.remove();
       c.remove( );

  }