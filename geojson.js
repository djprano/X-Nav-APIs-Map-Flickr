function borrar(){
    $('#results').empty();
    $('#flickr').empty();
    $("#flickr").hide(1500);

}

function chooseAddr() {
    var li = $(this).text();
    var text = li.split(':');
    var coords = text[1].split(',');
    var ref = text[0].split(',');
    var sitio = ref[0];
    var location = new L.LatLng(coords[0], coords[1]);
    map.panTo(location);
    var p = L.popup();
    p
    .setLatLng(location)
    .setContent(text[0])
    .openOn(map);

    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    $.getJSON( flickerAPI, {
        tags: sitio,
        tagmode: "any",
        format: "json"
    }).done(function(data){
        var i;
        $('#flickr').empty();
        for(i=0;i<data.items.length;i++){
            var image = new Image();
            image.src=data.items[i].media.m;
            image.height=100;
            image.width=100;
            $('#flickr').append(image);
            $("#flickr").show(1500);
        }
    });
}


    function buscar(){

        lugar = $('#addr').val();
        items = [];
        $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q='+lugar,function(data){
            $.each(data,function(key,value){
                items.push("<li>"+value.display_name+": "+value.lat+","+value.lon+"</li>");
            });

            $('#results').empty();
            if(items.length !=0){
                for (i in items){$('#results').append(items[i]);}
            }else{
                $('#results').append('<p>No results found</p>');
            }
            $('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
            $("#close").click(borrar);
            $('#results').on('click', 'li', chooseAddr);
        });


    }


    $(document).ready(function() {

    //ocultar el div de flickr
    $("#flickr").hide();

    //Create de event button search
    $("div#buscar button").click(buscar);


    // Create a map in the "map" div
    map = L.map('map');
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