/**
 * Initialize the map.
 */
function initMap() {
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({tileSize: tilesize, zIndex: 200}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
            "airtemp": new L.FLayer.Dmi.airTemperature({tileSize: tilesize, zIndex: 100}),
//            "humidity": new L.FLayer.Dmi.humidity({tileSize: tilesize, zIndex: 100}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({tileSize: tilesize, zIndex: 100})
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({tileSize: tilesize, zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({tileSize: tilesize, zIndex: 200}),
//            "visibility":  new L.FLayer.Noaa.visibility({tileSize: tilesize, zIndex: 100})
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		 {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
        },
        "Celestial information": {
            "Sun and Moon": new L.Terminator(),
        }
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 8;
    var lat = 35.5;
    var lon = 33.9;
    var useGeolocation = true;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeolocation, useGeoMetoc);
}
