(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, initCommonMap, getTilesize, getLocalLanguage, domain*/
    $(document).ready(function () {
        /**
         * Initialize the map.
         */
        var minZoom;
        var maxZoom;
        var zoom;
        var lat;
        var lon;
        var overlays;
        var tilesize = getTilesize();
        var lang = getLocalLanguage();
        var store = new L.Control.FcooLayerStore({language: lang});
        var basemap = "FCOO Standard";
        var langs = ['da', 'en'];
        var useGeoMetoc = false;
        var enablePrint = true;

        if (domain === 'denmark_impact') {
            minZoom = 4;
            maxZoom = 10;
            zoom = 6;
            lat = 55.7;
            lon = 11.1;
            overlays = {
                "Internal Ops [ECMWF]": {
                    "Helo": new L.FImpactLayer.helo_tol_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RHIB": new L.FImpactLayer.rhib_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "LCP": new L.FImpactLayer.lcp_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RAS": new L.FImpactLayer.replenishment_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Boarding": new L.FImpactLayer.boarding_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "UAV": new L.FImpactLayer.uav_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground})
                },
                "External Ops [ECMWF]": {
                    "Skiff": new L.FImpactLayer.skiff_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Dhow": new L.FImpactLayer.dhow_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:120GT": new L.FImpactLayer.fishingboat_120_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:500GT": new L.FImpactLayer.fishingboat_500_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:1000GT": new L.FImpactLayer.fishingboat_1000_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:2000GT": new L.FImpactLayer.fishingboat_2000_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_ecmwf_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground})
                },
                "Internal Ops [DMI/FCOO]": {
                    "Helo": new L.FImpactLayer.helo_tol_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RHIB": new L.FImpactLayer.rhib_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "LCP": new L.FImpactLayer.lcp_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RAS": new L.FImpactLayer.replenishment_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Boarding": new L.FImpactLayer.boarding_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "UAV": new L.FImpactLayer.uav_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground})
                },
                "External Ops [DMI/FCOO]": {
                    "Skiff": new L.FImpactLayer.skiff_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Dhow": new L.FImpactLayer.dhow_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:120GT": new L.FImpactLayer.fishingboat_120_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:500GT": new L.FImpactLayer.fishingboat_500_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:1000GT": new L.FImpactLayer.fishingboat_1000_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:2000GT": new L.FImpactLayer.fishingboat_2000_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_dk({tileSize: tilesize, zIndex: 100, foreground: store.foreground})
                },
                "DMI": {
                    "Wind Speed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'})
                },
                "FCOO - North Sea/Baltic Sea": {
                    "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveDirection'})
                },
                "FCOO - Danish Waters": {
                    "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveDirection'})
                },
                "ECMWF": {
                    "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection'}),
                    "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection'})
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "Static layers": {
                    "EEZ": store.EEZ,
                    "Firing areas": store.firingAreas
                }
            };
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'denmark') {
            minZoom = 4;
            maxZoom = 10;
            zoom = 6;
            lat = 55.7;
            lon = 11.1;
            enablePrint = false;
            var link_template = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003__STATION__:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
            $.getJSON(location.protocol + "//app.fcoo.dk/ifm-maps/json/Observations.json", function (data) {
                var geojson = L.geoJson(data, {
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
                    },
                    /*jshint unused: true*/
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
                    /*jshint unused: false*/
                });

                overlays = {
                    "DMI": {
                        "Wind Speed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                        "Wind Direction": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                        //"Visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                        "Sea Level Pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                        //"Precipitation": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                        //"Air Temperature (2m)": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                        //"Total Cloud Cover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
                    },
                    "FCOO - North Sea/Baltic Sea": {
                        "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'wavePeriod'}),
                        "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveHeight'}),
                        "Sea State": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'seaState'}),
                        "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveDirection'}),
                        "Current Speed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'currentSpeed'}),
                        "Current Direction": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'currentDirection'}),
                        "Sea Surface Elevation": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'seaLevel'}),
                        "Sea Temperature": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'sst'}),
                        "Salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'sss'}),
                    },
                    "FCOO - Danish Waters": {
                        "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'wavePeriod'}),
                        "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveHeight'}),
                        "Sea State": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'seaState'}),
                        "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveDirection'}),
                        "Current Speed": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'currentSpeed'}),
                        "Current Direction": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'currentDirection'}),
                        "Sea Surface Elevation": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'seaLevel'}),
                        "Sea Temperature": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'sst'}),
                        "Salinity": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'sss'})
                    },
                    "ECMWF": {
                        "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed'}),
                        "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection'}),
                        "Sea Level Pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure'}),
                        "Precipitation": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation'}),
                        "Air Temperature (2m)": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature'}),
                        "Total Cloud Cover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover'}),
                        "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod'}),
                        "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight'}),
                        "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState'}),
                        "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection'})
                    },
                    "Point forecasts": {
                        "Sea level": geojson,
                    },
                    "Celestial information": {
                        "Solar Terminator": store.solarTerminator
                    },
                    "Static layers": {
                        "EEZ": store.EEZ,
                        "Firing areas": store.firingAreas
                    }
                };
                initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
            });
        } else if (domain === 'faroe_islands') {
            overlays = {
                "DMI": {
                    "Wind Speed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                    //"Visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                    "Sea Level Pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                    //"Precipitation": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                    //"Air Temperature (2m)": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                    //"Total Cloud Cover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
                },
                "FCOO": {
                    "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
                },
                "ECMWF": {
                    "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                    "Sea Level Pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure'}),
                    "Precipitation": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation'}),
                    "Air Temperature (2m)": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature'}),
                    "Total Cloud Cover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover'}),
                    "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'})
                },
                "NOAA": {
                    "Current Speed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed'}),
                    "Current Direction": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection'}),
                    "Sea Temperature": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst'}),
                    "Salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss'})
                }, 
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "Static layers": {
                    "EEZ": store.EEZ,
                }
            };
            langs = ['da', 'fo', 'en'];
            minZoom = 3;
            maxZoom = 10;
            zoom = 7;
            lat = 61.5;
            lon = -6.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'greenland_impact') {
            overlays = {
                "Internal Ops [ECMWF]": {
                    "Helo": new L.FImpactLayer.helo_tol_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RHIB": new L.FImpactLayer.rhib_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "LCP": new L.FImpactLayer.lcp_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RAS": new L.FImpactLayer.replenishment_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Boarding": new L.FImpactLayer.boarding_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "UAV": new L.FImpactLayer.uav_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                },
                "External Ops [ECMWF]": {
                    "Skiff": new L.FImpactLayer.skiff_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Dhow": new L.FImpactLayer.dhow_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:120GT": new L.FImpactLayer.fishingboat_120_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:500GT": new L.FImpactLayer.fishingboat_500_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:1000GT": new L.FImpactLayer.fishingboat_1000_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:2000GT": new L.FImpactLayer.fishingboat_2000_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                },
                "Internal Ops [DMI/FCOO]": {
                    "Helo": new L.FImpactLayer.helo_tol_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RHIB": new L.FImpactLayer.rhib_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "LCP": new L.FImpactLayer.lcp_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RAS": new L.FImpactLayer.replenishment_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Boarding": new L.FImpactLayer.boarding_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "UAV": new L.FImpactLayer.uav_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                },
                "External Ops [DMI/FCOO]": {
                    "Skiff": new L.FImpactLayer.skiff_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Dhow": new L.FImpactLayer.dhow_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:120GT": new L.FImpactLayer.fishingboat_120_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:500GT": new L.FImpactLayer.fishingboat_500_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:1000GT": new L.FImpactLayer.fishingboat_1000_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:2000GT": new L.FImpactLayer.fishingboat_2000_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                },
                "DMI": {
                    "Wind Speed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                    "Visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                    "Sea Ice Concentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration'})
                },
                "FCOO": {
                    "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
                },
                "ECMWF": {
                    "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                    "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'})
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "Static layers": {
                    "EEZ": store.EEZ,
                    "SAR": store.SAR
                }
            };
            minZoom = 3;
            maxZoom = 10;
            zoom = 6;
            lat = 62.0;
            lon = -45.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'greenland') {
            var popstr;
            var tidal_url_base = location.protocol + "//api.fcoo.dk/tides?station={s}&start={t1}&end={t2}&nx=500&ny=350&lang={l}&tz={dt}";
            var tidal_stations = "../json/tidal_stations_greenland.json";
            $.getJSON(tidal_stations, function (tidal_data) {
                var geojson = L.geoJson(tidal_data, {
                    onEachFeature: function (feature, layer) {
                        var t1 = new Date();
                        var dt = t1.getTimezoneOffset();
                        t1.setUTCHours(0);
                        t1.setUTCMinutes(0);
                        t1.setUTCSeconds(0);
                        t1.setUTCMilliseconds(0);
                        var t2 = new Date();
                        t2.setUTCDate(t2.getDate() + 3);
                        t2.setUTCHours(0);
                        t2.setUTCMinutes(0);
                        t2.setUTCSeconds(0);
                        t2.setUTCMilliseconds(0);
                        t1 = t1.toISOString();
                        t2 = t2.toISOString();
                        var tidal_url = tidal_url_base.replace('{s}', feature.properties.id);
                        tidal_url = tidal_url.replace('{t1}', t1);
                        tidal_url = tidal_url.replace('{t2}', t2);
                        tidal_url = tidal_url.replace('{l}', lang);
                        var popups = {};
                        popups.en = '<h2>Tidal forecast for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidal forecasts from <a href="http://dmi.dk">DMI</a>. Tidal tables can be found <a href="http://www.dmi.dk/en/groenland/hav/tidevandstabeller-groenland/">here</a>.</p>';
                        popups.da = '<h2>Tidevandsprognose for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidevandsprognoser fra <a href="http://dmi.dk">DMI</a>. Tidevandstabeller kan findes <a href="http://www.dmi.dk/groenland/hav/tidevandstabeller-groenland/">her</a>.</p>';
                        if (typeof popups[lang] != 'undefined') {
                            popstr = popups[lang];
                        } else {
                            popstr = popups.en;
                        }
                        feature.properties.popup = popstr;
                        popstr = popstr.replace('{dt}', dt);
                        layer.bindPopup(popstr,
                                        {maxWidth: 700, maxHeight: 600});
                    },
                    /*jshint unused: true*/
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
                    /*jshint unused: true*/
                });
                overlays = {
                    "DMI": {
                        "Wind Speed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed'}),
                        "Wind Direction": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                        "Visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                        "Sea Level Pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure'}),
                        //"Precipitation": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation'}),
                        "Air Temperature (2m)": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature'}),
                        "Total Cloud Cover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover'}),
                        "Sea Ice Concentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration'})
                    },
                    "FCOO": {
                        "Wave Period": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                        "Wave Height": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                        "Sea State": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                        "Wave Direction": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
                    },
                    "ECMWF": {
                        "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                        "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                        "Sea Level Pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure'}),
                        "Precipitation": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation'}),
                        "Air Temperature (2m)": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature'}),
                        "Total Cloud Cover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover'}),
                        "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                        "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                        "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState'}),
                        "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'})
                    },
                    "NOAA": {
                        "Current Speed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed'}),
                        "Current Direction": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection'}),
                        "Sea Temperature": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst'}),
                        "Salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss'})
                    }, 
                    "Point forecasts": {
                        "Tidal forecasts": geojson
                    },
                    "Celestial information": {
                        "Solar Terminator": store.solarTerminator
                    },
                    "Static layers": {
                        "EEZ": store.EEZ,
                        "SAR": store.SAR
                    }
                };

                minZoom = 3;
                maxZoom = 10;
                zoom = 6;
                lat = 62.0;
                lon = -45.0;
                initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
            });
        } else if (domain === 'indian_ocean') {
            overlays = {
                "ECMWF": {
                    "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
                    "Sea Level Pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure'}),
                    "Precipitation": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation'}),
                    "Air Temperature (2m)": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature'}),
                    "Total Cloud Cover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover'}),
                    "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection'})
                },
                "NOAA": {
                    "Current Speed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed'}),
                    "Current Direction": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection'}),
                    "Sea Temperature": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst'}),
                    "Salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss'})
                }, 
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "Static layers": {
                    "EEZ": store.EEZ,
                    "DBPedia (experimental)": L.dbPediaLayer({lang: 'en', includeCities: true, minZoom: 8})
                }
            };
            minZoom = 4;
            maxZoom = 10;
            zoom = 5;
            lat = 0.0;
            lon = 56.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'indian_ocean_impact') {
            overlays = {
                "Internal Ops [ECMWF]": {
                    "Helo": new L.FImpactLayer.helo_tol_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RHIB": new L.FImpactLayer.rhib_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "LCP": new L.FImpactLayer.lcp_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "RAS": new L.FImpactLayer.replenishment_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Boarding": new L.FImpactLayer.boarding_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "UAV": new L.FImpactLayer.uav_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                },
                "External Ops [ECMWF]": {
                    "Skiff": new L.FImpactLayer.skiff_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Dhow": new L.FImpactLayer.dhow_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:120GT": new L.FImpactLayer.fishingboat_120_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:500GT": new L.FImpactLayer.fishingboat_500_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:1000GT": new L.FImpactLayer.fishingboat_1000_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Fishing:2000GT": new L.FImpactLayer.fishingboat_2000_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic1": new L.FImpactLayer.generic_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                    "Generic2": new L.FImpactLayer.generic_ecmwf_io({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                },
                "ECMWF": {
                    "Wind Speed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
                    "Sea Level Pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure'}),
                    "Precipitation": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation'}),
                    "Air Temperature (2m)": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature'}),
                    "Total Cloud Cover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover'}),
                    "Wave Period": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod'}),
                    "Wave Height": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight'}),
                    "Sea State": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState'}),
                    "Wave Direction": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection'})
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "Static layers": {
                    "EEZ": store.EEZ,
                    "SAR": store.SAR
                }
            };
            minZoom = 4;
            maxZoom = 10;
            zoom = 5;
            lat = 0.0;
            lon = 56.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'mediterranean') {
            overlays = {
                "DMI": {
                    "Wind Speed": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windSpeed'}),
                    "Wind Direction": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windDirection'}),
                    "Sea Level Pressure": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'seaLevelPressure'}),
                    "Air Temperature (2m)": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'airTemperature'}),
                    "Total Cloud Cover": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'totalCloudCover'}),
                },
                "NOAA": {
                    "Current Speed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed'}),
                    "Current Direction": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection'}),
                    "Sea Temperature": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst'}),
                    "Salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss'})
                }, 
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "Static layers": {
                    "EEZ": store.EEZ
                }
            };
            minZoom = 3;
            maxZoom = 10;
            zoom = 8;
            lat = 35.5;
            lon = 33.9;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else {
            throw new Error('Valid domain not specified: ' + domain);
        }
    });

})();
