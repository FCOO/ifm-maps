/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'fo', 'en'];
    var basemap = "OSM Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({}),
            "winddirection": new L.FLayer.Dmi.windDirection({}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({}),
            "seatemp": new L.FLayer.Noaa.sst({}),
            "salinity": new L.FLayer.Noaa.sss({}),
            "visibility":  new L.FLayer.Noaa.visibility({})
        }
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
