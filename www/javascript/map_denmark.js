/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "OSM Standard";
    var overlays = {
	"elev": new L.FLayer.Fcoo.elevation({}),
        "windspeed": new L.FLayer.Dmi.windSpeed({}),
        "winddirection": new L.FLayer.Dmi.windDirection({}),
        "waveheight": new L.FLayer.Fcoo.waveHeight({}),
	"wavedirection": new L.FLayer.Fcoo.waveDirection({}),
        "currentspeed": new L.FLayer.Fcoo.currentSpeed({}),
        "currentdirection": new L.FLayer.Fcoo.currentDirection({})
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
