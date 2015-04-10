function buscar(){

    lugar = $('#addr').value();
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q='+lugar,function(data){
        console.log(data);
    });


}

$(document).ready(function() {

    //Create de event button search
    $("div#search button").click(buscar);
    // Create a map in the "map" div
    var map = L.map('map');
    // Set the view to current location
    map.setView([40.2838, -3.8215], 15);
    // Add a MapQuest map
    L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
    }).addTo(map);

    // Define one GeoJSON feature
    var geojsonFeature = {
    	"type": "Feature",
    	"properties": {
    		"name": "Aulario III",
    		"amenity": "Classrooms Building",
    		"popupContent": "Most of the classes of ETSIT are taught here."
    	},
    	"geometry": {
    		"type": "Point",
    		"coordinates": [-3.8215, 40.2838]
    	}
    };
    

    // Define a function to show the name property
    function popUpName(feature, layer) {
	// does this feature have a property named popupContent?
	if (feature.properties && feature.properties.Name) {
		layer.bindPopup(feature.properties.Name);
	}
}

    // Add to map a layer with the geojsonFeature point
    var myLayer = L.geoJson().addTo(map);
    myLayer.addData(geojsonFeature);

    // Add to map a layer with all points in buildings-urjc.json
    $.getJSON("buildings-urjc.json", function(data) {
    	buildingsLayer = L.geoJson(data,{
    		onEachFeature: popUpName
    	}).addTo(map);
    });

    // Show lat and long at clicked (event) point, with a popup
    var popup = L.popup();
    function showPopUp(e) {
    	popup
    	.setLatLng(e.latlng)
    	.setContent("Coordinates: " + e.latlng.toString())
    	.openOn(map);
    }
    // Subscribe to the "click" event
    map.on('click', showPopUp);

    // Show a circle around current location
    function onLocationFound(e) {
    	var radius = e.accuracy / 2;
    	L.marker(e.latlng).addTo(map)
    	.bindPopup("You are within " + radius +
    		" meters from this point<br/>" +
    		"Coordinates: " + e.latlng.toString())
    	.openPopup();
    	L.circle(e.latlng, radius).addTo(map);
    }
    // Subscribe to the "location found" event
    map.on('locationfound', onLocationFound);

    // Show alert if geolocation failed
    function onLocationError(e) {
    	alert(e.message);
    }
    // Subscribe to the "location error" event
    map.on('locationerror', onLocationError);

});