$(document).ready(function() {
    /**
     * Initialize the map.
     */
    var basemap = "FCOO Standard";
    var store = new L.Control.FcooLayerStore;
    var overlays = {
        "DMI": {
            "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windSpeed'}),
            "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windDirection'}),
            "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'seaLevelPressure'}),
            "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'airTemperature'}),
            "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'totalCloudCover'}),
        },
        "NOAA": {
            "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed'}),
            "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection'}),
            "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst'}),
            "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss'})
        }, 
        "boundaries": {
            "EEZ": store.EEZ
        },
        "Celestial information": {
            "Sun and Moon": store.solarTerminator
        }
    }
    var tilesize = getTilesize();
    var langs = ['da', 'en'];
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 8;
    var lat = 35.5;
    var lon = 33.9;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
});
