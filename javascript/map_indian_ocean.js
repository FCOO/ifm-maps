$(document).ready(function() {
    /**
     * Initialize the map.
     */
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({tileSize: tilesize, zIndex: 200}),
            "pressure": new L.FLayer.Ecmwf.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
            "precip": new L.FLayer.Ecmwf.totalPrecipitation({tileSize: tilesize, zIndex: 100}),
            "airtemp": new L.FLayer.Ecmwf.airTemperature({tileSize: tilesize, zIndex: 100}),
            "cloudcover": new L.FLayer.Ecmwf.totalCloudCover({tileSize: tilesize, zIndex: 100}),
            "waveperiod": new L.FLayer.Ecmwf.wavePeriod({tileSize: tilesize, zIndex: 100}),
            "waveheight": new L.FLayer.Ecmwf.waveHeight({tileSize: tilesize, zIndex: 100}),
            "wavedirection": new L.FLayer.Ecmwf.waveDirection({tileSize: tilesize, zIndex: 200}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({tileSize: tilesize, zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({tileSize: tilesize, zIndex: 200})
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		 {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
        },
        "Celestial information": {
            "Sun and Moon": new L.Terminator(),
        },
        "places": {
            "DBPedia (experimental)": L.dbPediaLayer({lang: 'en', includeCities: true, minZoom: 8}),
        }
    }
    var minZoom = 4;
    var maxZoom = 10;
    var zoom = 5;
    var lat = 0.0;
    var lon = 56.0;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
});
