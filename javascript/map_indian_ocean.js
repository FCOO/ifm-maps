"use strict";
/*jslint browser: true*/
/*global $, L*/

$(document).ready(function () {
    /**
     * Initialize the map.
     */
    var basemap = "FCOO Standard";
    var store = new L.Control.FcooLayerStore;
    var overlays = {
        "ECMWF": {
            "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
            "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
            "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure'}),
            "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation'}),
            "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature'}),
            "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover'}),
            "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod'}),
            "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight'}),
            "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection'})
        },
        "NOAA": {
            "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed'}),
            "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection'}),
            "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst'}),
            "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss'})
        }, 
        "boundaries": {
            "EEZ": store.EEZ
        },
        "Celestial information": {
            "Sun and Moon": store.solarTerminator
        },
        "places": {
            "DBPedia (experimental)": L.dbPediaLayer({lang: 'en', includeCities: true, minZoom: 8}),
        }
    }

    var tilesize = getTilesize();
    var langs = ['da', 'en'];
    var minZoom = 4;
    var maxZoom = 10;
    var zoom = 5;
    var lat = 0.0;
    var lon = 56.0;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
});
