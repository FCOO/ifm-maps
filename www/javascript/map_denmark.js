/**
 * Initialize the map.
 */
function initMap() {
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var landLayer = new L.CountingTileLayer(fcoo_base + "tiles_frgrnd_" + tilesize + "_mercator_201411070000/{z}/{x}/{y}.png", {
        maxZoom: 10,
        tileSize: tilesize,
        subdomains: subdomains,
        zIndex: 1000,
        continuousWorld: false,
        errorTileUrl: fcoo_base + "empty_" + tilesize + ".png"
    });

    var minZoom = 5;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 55.7;
    var lon = 11.1;
    var useGeolocation = true;
    var useGeoMetoc = false;

    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";

    var link_template = "http://ifm.fcoo.dk/asp/oceanChart.asp?hindcastPeriod=12&forecastPeriod=24&width=500&height=350&id=__STATION__&paramId=SeaLvl&forecastMode=1";
    $.getJSON("http://api.fcoo.dk/ifm-maps/json/Observations.json", function(data) {
        var geojson = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                           radius: 5,
                           fillColor: "#ff7800",
                           color: "#000",
                           weight: 1,
                           opacity: 1,
                           fillOpacity: 0.8
                });
            }
        });
        var overlays = {
            "DMI": {
                "windspeed": new L.FLayer.Dmi.windSpeed({tileSize: tilesize, zIndex: 100}),
                "winddirection": new L.FLayer.Dmi.windDirection({tileSize: tilesize, zIndex: 200}),
            },
            "FCOO - North Sea/Baltic Sea": {
                "waveperiod": new L.FLayer.Fcoo.wavePeriod({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'NSBaltic'),
                "waveheight": new L.FLayer.Fcoo.waveHeight({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'NSBaltic'),
	        "wavedirection": new L.FLayer.Fcoo.waveDirection({tileSize: tilesize, zIndex: 200, foreground: landLayer}, 'NSBaltic'),
                "currentspeed": new L.FLayer.Fcoo.currentSpeed({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
                "currentdirection": new L.FLayer.Fcoo.currentDirection({tileSize: tilesize, zIndex: 200, foreground: landLayer}, 'nsbalt'),
	        "elev": new L.FLayer.Fcoo.elevation({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
	        "seatemp": new L.FLayer.Fcoo.sst({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
	        "salinity": new L.FLayer.Fcoo.sss({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
            },
            "FCOO - Danish Waters": {
                "waveperiod": new L.FLayer.Fcoo.wavePeriod({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'DKinner'),
                "waveheight": new L.FLayer.Fcoo.waveHeight({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'DKinner'),
	        "wavedirection": new L.FLayer.Fcoo.waveDirection({tileSize: tilesize, zIndex: 201, foreground: landLayer}, 'DKinner'),
                "currentspeed": new L.FLayer.Fcoo.currentSpeed({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
                "currentdirection": new L.FLayer.Fcoo.currentDirection({tileSize: tilesize, zIndex: 201, foreground: landLayer}, 'idk'),
	        "elev": new L.FLayer.Fcoo.elevation({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
	        "seatemp": new L.FLayer.Fcoo.sst({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
	        "salinity": new L.FLayer.Fcoo.sss({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
            },
            "boundaries": {
                "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		     {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
            },
            "stations": {
                "Sea level": geojson,
            },
        }

        initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeolocation, useGeoMetoc);
    });

}
