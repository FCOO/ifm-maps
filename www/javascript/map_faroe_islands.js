/**
 * Initialize the map.
 */
function initMap() {
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var langs = ['da', 'fo', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({tileSize: tilesize, zIndex: 200}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({tileSize: tilesize, zIndex: 200})
        },
        "FCOO": {
            "waveperiod": new L.FLayer.Fcoo.wavePeriod({tileSize: tilesize, zIndex: 100}, 'Greenland'),
            "waveheight": new L.FLayer.Fcoo.waveHeight({tileSize: tilesize, zIndex: 100}, 'Greenland'),
	    "wavedirection": new L.FLayer.Fcoo.waveDirection({tileSize: tilesize, zIndex: 200}, 'Greenland'),
        },
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({tileSize: tilesize, zIndex: 200}),
            "pressure": new L.FLayer.Ecmwf.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
            "airtemp": new L.FLayer.Ecmwf.airTemperature({tileSize: tilesize, zIndex: 100}),
            "cloudcover": new L.FLayer.Ecmwf.totalCloudCover({tileSize: tilesize, zIndex: 100}),
            "waveperiod": new L.FLayer.Ecmwf.wavePeriod({tileSize: tilesize, zIndex: 100}),
            "waveheight": new L.FLayer.Ecmwf.waveHeight({tileSize: tilesize, zIndex: 100}),
            "wavedirection": new L.FLayer.Ecmwf.waveDirection({tileSize: tilesize, zIndex: 200}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({tileSize: tilesize, zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({tileSize: tilesize, zIndex: 200}),
            "seatemp": new L.FLayer.Noaa.sst({tileSize: tilesize, zIndex: 100}),
            "salinity": new L.FLayer.Noaa.sss({tileSize: tilesize, zIndex: 100}),
        },
        "boundaries": {
            "EEZ": new L.TileLayer(fcoo_base + "tiles_eez_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		 {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
        },
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 7;
    var lat = 61.5;
    var lon = -6.0;
    var useGeolocation = true;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeolocation, useGeoMetoc);
}
