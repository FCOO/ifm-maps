/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'fo', 'en'];
    var basemap = "OSM Standard";
    var overlays = {
        "windspeed": new L.FLayer.windSpeed({}),
        "winddirection": new L.FLayer.windDirection({}),
        "currentspeed": new L.FLayer.currentSpeed({}),
        "currentdirection": new L.FLayer.currentDirection({}),
        "seatemp": new L.FLayer.sst({}),
        "salinity": new L.FLayer.sss({}),
        "pressure": new L.FLayer.seaLevelPressure({}),
        "visibility":  new L.FLayer.visibility({})
    }
    var minZoom = 2;
    var maxZoom = 12;
    var zoom = 7;
    var lat = 61.5;
    var lon = -6.0;
    var useGeolocation = true;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
