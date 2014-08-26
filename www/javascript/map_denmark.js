/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "OSM Standard";
    var overlays = {
	"elev": new L.FLayer.elevation({}),
        "windspeed": new L.FLayer.windSpeed({}),
        "winddirection": new L.FLayer.windDirection({}),
        "waveheight": new L.FLayer.waveHeight({}),
	"wavedirection": new L.FLayer.waveDirection({}),
        "currentspeed": new L.FLayer.currentSpeed({}),
        "currentdirection": new L.FLayer.currentDirection({})
    }
    var minZoom = 5;
    var maxZoom = 12;
    var zoom = 6;
    var lat = 55.7;
    var lon = 11.1;
    var useGeolocation = true;
    var useGeoMetoc = true;
    var useIfmChart = true;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
