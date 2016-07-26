$(function() {
    //               FUNCTIONS START               */
    //filter function
    function inRange(tweet){
        var tweetDate = new Date(tweet.created_at);
        return tweetDate >= startDate && tweetDate <= endDate;
    }
    //functions in object, they do exactly what you think they do.
    var set = {
        controlFilter: function () {
            controlFilters.Opinions = build.layer(tweets.opinions.statuses.filter(inRange), icons.opinion);
            controlFilters.Weather = build.layer(tweets.weather.statuses.filter(inRange), icons.weather);
            controlFilters.Crime = build.layer(tweets.crime.statuses.filter(inRange), icons.crime);
            controlFilters.Traffic = build.layer(tweets.traffic.statuses.filter(inRange), icons.traffic);
        },
        icons: function(){
            icons.opinion = build.icon('images/markerOpinion.png', [39.08, 60], [22, 94], [6, -76]);
            icons.weather = build.icon('images/markerWeather.png', [39.08, 60], [22, 94], [6, -76]);
            icons.crime = build.icon('images/markerCrime.png', [39.08, 60], [22, 94], [6, -76]);
            icons.traffic = build.icon('images/markerTraffic.png', [39.08, 60], [22, 94], [6, -76]);
        }

    };
    var remove = {
        layers: function(){
            map.removeLayer(controlFilters.Opinions);
            map.removeLayer(controlFilters.Weather);
            map.removeLayer(controlFilters.Crime);
            map.removeLayer(controlFilters.Traffic);
        }
    };
    var build = {
        icon: function (imageUrl, iconSize, iconAnchor, popupAnchor) {
            var options = L.icon({
                iconUrl: imageUrl,
                iconSize: iconSize,
                iconAnchor: iconAnchor,
                popupAnchor: popupAnchor
            });
            return options;
        },
        layer: function (data, icon) {//change build later code
            var temparr = [];
            data.forEach(function (tweet) {
                temparr.push(L.marker(tweet.coordinates, {icon: icon}).bindPopup(tweet.text));
            });
            return L.layerGroup(temparr);
        },
        date: function () {
            var start = moment().subtract(29, 'days');
            var end = moment();

            $('input[name="range"]').daterangepicker({
                startDate: start,
                endDate: end,
                autoUpdateInput: false,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, this.datecb);
            this.datecb(start, end);
        },
        datecb: function (start, end) {//cb called on set or change
            $('input[name="range"]').val(start.format('MMM D YYYY') + ' - ' + end.format('MMM D YYYY'));
            startDate = new Date(start);
            endDate = new Date(end);
            //check if map has layer control already built
            if (mapHasControl) {
                remove.layers();
                layerControl.removeFrom(map);
            }
            set.controlFilter();
            mapHasControl = true;
            layerControl = L.control.layers(null, controlFilters).addTo(map);
        }
    };
    /*               FUNCTIONS END               */
    
    //init vars
    var controlFilters = {};
    var layerControl;
    var mapHasControl = false;
    var tweets = {};
    var startDate;
    var endDate;
    var icons = {};
    set.icons();

    //getJSON calls
    $.getJSON("http://localhost:3000/opinions", function (tweetOpinions) {
        //add all tweets to tweet feed sidebar
        var feed = '';
        tweetOpinions.statuses.forEach(function (tweet) {
            feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';
        });
        document.getElementById('feed').innerHTML += feed;
        //set a variable with the tweets to use
        tweets.opinions = tweetOpinions;
        //check if this was the last callback to finish, if it is let's start building.
        if (
            tweets.hasOwnProperty('weather') &&
            tweets.hasOwnProperty('crime') &&
            tweets.hasOwnProperty('traffic')) {
            build.date();
        }
    });
    $.getJSON("http://localhost:3000/weather", function (tweetWeather) {
        //add all tweets to tweet feed sidebar
        var feed = '';
        tweetWeather.statuses.forEach(function (tweet) {
            feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';
        });
        document.getElementById('feed').innerHTML += feed;
        //set a variable with the tweets to use
        tweets.weather = tweetWeather;
        //check if this was the last callback to finish, if it is let's start building.
        if (
            tweets.hasOwnProperty('opinions') &&
            tweets.hasOwnProperty('crime') &&
            tweets.hasOwnProperty('traffic')) {
            build.date();
        }
    });
    $.getJSON("http://localhost:3000/crime", function (tweetCrime) {
        //add all tweets to tweet feed sidebar
        var feed = '';
        tweetCrime.statuses.forEach(function (tweet) {
            feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';
        });
        document.getElementById('feed').innerHTML += feed;
        //set a variable with the tweets to use
        tweets.crime = tweetCrime;
        //check if this was the last callback to finish, if it is let's start building.
        if (
            tweets.hasOwnProperty('opinions') &&
            tweets.hasOwnProperty('weather') &&
            tweets.hasOwnProperty('traffic')) {
            build.date();
        }
    });
    $.getJSON("http://localhost:3000/traffic", function (tweetTraffic) {
        //add all tweets to tweet feed sidebar
        var feed = '';
        tweetTraffic.statuses.forEach(function (tweet) {
            feed += "<div style='text-align:center; background-color: black;'>" + tweet.user.name + "</div>" + "<hr>" + tweet.text + '<hr>';
        });
        tweets.traffic = tweetTraffic;
        //set a variable with the tweets to use
        document.getElementById('feed').innerHTML += feed;
        //check if this was the last callback to finish, if it is let's start building.
        if (
            tweets.hasOwnProperty('opinions') &&
            tweets.hasOwnProperty('weather') &&
            tweets.hasOwnProperty('crime')) {
            build.date();
        }
    });
});