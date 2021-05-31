let constraints = { video: true, audio: true };
let videoPlayer = document.querySelector('video');
let audioPlayer = document.querySelector('audio');
let videoRecordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture'); 
let mediaRecorder;
let recordState = false;
let chunks = [];
let filter = '';
let currentZoom =1;
let zoomInBtn = document.getElementById('in');
let zoomOutBtn = document.getElementById('out');

zoomInBtn.addEventListener('click',function(){
  let videoScale = Number(
  videoPlayer.style.transform.split("(")[1].split(")")[0]  
  )
  if(videoScale<3){
      currentZoom = videoScale+0.1;
      videoPlayer.style.transform=`scale(${currentZoom})`;
  }
});
zoomOutBtn.addEventListener('click',function(){
    let videoScale = Number(
    videoPlayer.style.transform.split("(")[1].split(")")[0]  
    )
    if(videoScale>1){
        currentZoom = videoScale-0.1;
        videoPlayer.style.transform=`scale(${currentZoom})`;
    }
  });


let allFilter  =document.querySelectorAll('.filter');
for(let i =0;i<allFilter.length;i++){
    allFilter[i].addEventListener('click',function(e){
        filter= e.currentTarget.style.backgroundColor;
        removeFilter();
        addFilterToStream(filter);
    })
}

function addFilterToStream(filterColor){
    let filter = document.createElement('div');
    filter.classList.add('on-screen-filter')
     filter.style.height='100vh';
     filter.style.width='100vw';
     filter.style.backgroundColor=`${filterColor}`;
     filter.style.position = 'fixed';
     filter.style.top = '0px';
     document.querySelector('body').appendChild(filter);
}

function removeFilter(){
    let element = document.querySelector('.on-screen-filter');
    if(element){
        element.remove();
    }  
}



videoRecordBtn.addEventListener("click", function () {
    if (mediaRecorder != undefined) {
        removeFilter();
        let innerDiv = videoRecordBtn.querySelector('#record-div');
        if (recordState == false) {
            recordState = true;
            innerDiv.classList.add('recording-animation');
            currentZoom=1 
            videoPlayer.style.transform = `scale(${currentZoom})`  
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
      capture(filter);
      setTimeout(function(){
        innerDiv.classList.remove('capture-animation')
    },1000);
  })
  function capture(){ 
      let c = document.createElement('canvas');
      c.width = videoPlayer.videoWidth;
      c.height = videoPlayer.videoHeight;
      let tool = c.getContext('2d');
    //   origin shifting
    tool.translate(c.width/2,c.height/2)
    // scaling
    tool.scale(currentZoom,currentZoom);
    //  move back to origin
    tool.translate(-c.width/2,-c.height/2);
      tool.drawImage(videoPlayer,0,0);
      if(filter!=''){
          tool.fillStyle = filter;
          tool.fillRect(0,0,c.width,c.height);
      }
      let link = document.createElement('a');
      link.download = 'image.jpg';
      link.href =c.toDataURL ();
       link.click();
       link.remove();
       c.remove( );

  }