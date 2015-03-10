"use strict";
/*jslint browser: true*/
/*global $, L, initCommonMap, getTilesize*/

$(document).ready(function () {
    /**
     * Initialize the map.
     */
    var tilesize = getTilesize();
    var store = new L.Control.FcooLayerStore();

    var langs = ['da', 'en'];
    var minZoom = 5;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 55.7;
    var lon = 11.1;
    var useGeoMetoc = false;
    var basemap = "FCOO Standard";

    var link_template = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003__STATION__:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
    $.getJSON(location.protocol + "//api.fcoo.dk/ifm-maps/json/Observations.json", function (data) {
        var geojson = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                           radius: 5,
                           fillColor: "#ff7800",
                           color: "#000",
                           weight: 1,
                           opacity: 1,
                           fillOpacity: 0.8
                });
            }
        });
        var overlays = {
            "DMI": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
            },
            "FCOO - North Sea/Baltic Sea": {
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveHeight'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveDirection'}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'currentDirection'}),
            "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'seaLevel'}),
            "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'sst'}),
            "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'sss'})
            },
            "FCOO - Danish Waters": {
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveHeight'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveDirection'}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'currentDirection'}),
            "elev": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'seaLevel'}),
            "seatemp": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'sst'}),
            "salinity": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'sss'})
            },
            "ECMWF": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection'})
            },
            "Point forecasts": {
                "Sea level": geojson,
            },
            "boundaries": {
                "EEZ": store.EEZ,
            },
            "Celestial information": {
                "Sun and Moon": store.solarTerminator
            }
        };

        initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
    });

});
