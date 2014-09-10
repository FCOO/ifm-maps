/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "OSM Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({}),
            "winddirection": new L.FLayer.Dmi.windDirection({}),
            "visibility":  new L.FLayer.Dmi.visibility({}),
            "iceconcentration": new L.FLayer.Dmi.iceConcentration({}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({}),
            "airtemp": new L.FLayer.Dmi.airTemperature({}),
            "humidity": new L.FLayer.Dmi.humidity({}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({})
        },
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({}),
            "seatemp": new L.FLayer.Noaa.sst({}),
            "salinity": new L.FLayer.Noaa.sss({}),
        }
    };
    var minZoom = 2;
    var maxZoom = 12;
    var zoom = 6;
    var lat = 62.0;
    var lon = -45.0;
    var useGeolocation = false;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
