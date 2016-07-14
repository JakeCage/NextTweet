function buildIcon(imageUrl, iconSize, iconAnchor, popupAnchor){
    var options = L.icon({
        iconUrl: imageUrl,
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor
    });
    return options;
}
function buildLayer(data, icon){//change build later code
    var temparr = [];
    data.statuses.forEach(function(tweet){
        temparr.push(L.marker(tweet.coordinates,{icon: icon}).bindPopup(tweet.text));
    });
    return L.layerGroup(temparr);
}

var controlFilters = {};

$.getJSON("http://localhost:3000/opinions",function(tweets){
    var opinionIcon = buildIcon(//build icon add arguments
        'images/markerOpinion.png',//iconUrl
        [39.08,60],//iconSize
        [22,94],//iconAnchor
        [6,-76]);//popupAnchor
    var feed = '';
    tweets.statuses.forEach(function(tweet){feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';});
    document.getElementById('feed').innerHTML += feed;
    controlFilters.Opinions = buildLayer(tweets, opinionIcon);
    if(
        controlFilters.hasOwnProperty('Weather') &&
        controlFilters.hasOwnProperty('Crime') &&
        controlFilters.hasOwnProperty('Traffic')){L.control.layers(null,controlFilters).addTo(map);
    }
});
$.getJSON("http://localhost:3000/weather",function(tweets){
    var weatherIcon = buildIcon(//build icon add arguments
        'images/markerWeather.png',//iconUrl TBD
        [39.08,60],//iconSize
        [22,94],//iconAnchor
        [6,-76]);//popupAnchor
    var feed = '';
    tweets.statuses.forEach(function(tweet){feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';});
    document.getElementById('feed').innerHTML += feed;
    controlFilters.Weather = buildLayer(tweets, weatherIcon);
    if(
        controlFilters.hasOwnProperty('Opinions') &&
        controlFilters.hasOwnProperty('Crime') &&
        controlFilters.hasOwnProperty('Traffic')){L.control.layers(null, controlFilters).addTo(map);
    }
});
$.getJSON("http://localhost:3000/crime",function(tweets){
    var crimeIcon = buildIcon(//build icon add arguments
        'images/markerCrime.png',//iconUrl TBD
        [39.08,60],//iconSize
        [22,94],//iconAnchor
        [6,-76]);//popupAnchor
    var feed = '';
    tweets.statuses.forEach(function(tweet){feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';});
    document.getElementById('feed').innerHTML += feed;
    controlFilters.Crime = buildLayer(tweets, crimeIcon);
    if(
        controlFilters.hasOwnProperty('Opinions') &&
        controlFilters.hasOwnProperty('Weather') &&
        controlFilters.hasOwnProperty('Traffic')){L.control.layers(null,controlFilters).addTo(map);
    }
});
$.getJSON("http://localhost:3000/traffic",function(tweets){
    var trafficIcon = buildIcon(//build icon add arguments
        'images/markerTraffic.png',//iconUrl TBD
        [39.08,60],//iconSize
        [22,94],//iconAnchor
        [6,-76]);//popupAnchor
    var feed = '';
    tweets.statuses.forEach(function(tweet){feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';});
    document.getElementById('feed').innerHTML += feed;
    controlFilters.Traffic = buildLayer(tweets, trafficIcon);
    if(
        controlFilters.hasOwnProperty('Opinions') &&
        controlFilters.hasOwnProperty('Weather') &&
        controlFilters.hasOwnProperty('Crime')){L.control.layers(null,controlFilters).addTo(map);
    }
});