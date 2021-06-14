let request = indexedDB.open('camera',1);
let db;

request.onsuccess=function(e){
    db=request.result;
}
request.onerror = function(e){
    console.log('error');
}
request.onupgradeneeded = function(e){
    db = request.result;
    db.createObjectStore('gallery',{keyPath:'mId'});
}
function addMediaToGallery(data,type){
     let tx = db.transaction('gallery','readwrite');
     let gallery = tx.objectStore('gallery');
     gallery.add({mId:Date.now(),type,media:data});
}