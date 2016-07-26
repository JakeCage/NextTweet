function changeLocation(){
    var selectedMA = document.getElementById("locat").value;
    if(selectedMA != "noMA"){
        map.panTo(allMA[selectedMA].bbox[0]);
    }
}
