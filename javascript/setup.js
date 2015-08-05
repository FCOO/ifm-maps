(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, initCommonMap, getTilesize, getLocalLanguage */

    /**
     * Initialize the map.
     */
    var urlParams = getUrlParameters();
    // The domain variable is used to determine which setup to use
    if (urlParams.domain !== undefined) {
        domain = urlParams.domain;
    }
    var minZoom;
    var maxZoom;
    var zoom;
    var lat;
    var lon;
    var overlays;
    var proxy;
    var tilesize = getTilesize();
    var lang = getLocalLanguage();
    var store = new L.Control.FcooLayerStore({language: lang});
    var basemap = "FCOO Standard";
    var langs = ['da', 'en'];
    var useGeoMetoc = false;
    var enablePrint = true;

    if (domain === 'denmark_impact') {
        minZoom = 4;
        maxZoom = 12;
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
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'})
            },
            "FCOO - North Sea/Baltic Sea": {
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveDirection'})
            },
            "FCOO - Danish Waters": {
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveDirection'})
            },
            "ECMWF": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection'})
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
                "Firing areas": store.firingAreas
            }
        };
    } else if (domain === 'denmark') {
        minZoom = 4;
        maxZoom = 12;
        zoom = 6;
        lat = 55.7;
        lon = 11.1;
        enablePrint = false;
        proxy = WmsAjaxProxy;

        overlays = {
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                //"visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                //"precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                //"airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                //"cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'wavePeriod', 'options': {ajaxProxy: proxy}}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveHeight', 'options': {ajaxProxy: proxy}}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'seaState', 'options': {ajaxProxy: proxy}}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveDirection', 'options': {ajaxProxy: proxy}}),
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentSpeed', 'options': {ajaxProxy: proxy}}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': {ajaxProxy: proxy}}),
                "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'seaLevel', 'options': {ajaxProxy: proxy}}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sst', 'options': {ajaxProxy: proxy}}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sss', 'options': {ajaxProxy: proxy}})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': {ajaxProxy: proxy}}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': {ajaxProxy: proxy}}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': {ajaxProxy: proxy}}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': {ajaxProxy: proxy}})
            },
            "Point forecasts": {
                "Sea level": undefined,
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
                "Firing areas": store.firingAreas
            }
        };
        proxy.doAjax();
    } else if (domain === 'faroe_islands') {
        overlays = {
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                //"visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                //"precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                //"airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                //"cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection'}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst'}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss'})
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
        maxZoom = 12;
        zoom = 7;
        lat = 61.5;
        lon = -6.0;
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
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration'})
            },
            "FCOO": {
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
            },
            "ECMWF": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'})
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
        maxZoom = 12;
        zoom = 6;
        lat = 62.0;
        lon = -45.0;
    } else if (domain === 'greenland') {
        minZoom = 3;
        maxZoom = 12;
        zoom = 6;
        lat = 62.0;
        lon = -45.0;
        overlays = {
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure'}),
                //"precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover'}),
                "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration'}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection'}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst'}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss'})
            }, 
            "Point forecasts": {
                "Tidal forecasts": undefined
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
                "SAR": store.SAR
            }
        };
    } else if (domain === 'indian_ocean') {
        overlays = {
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection'}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection'}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst'}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss'})
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
        maxZoom = 12;
        zoom = 5;
        lat = 0.0;
        lon = 56.0;
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
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection'})
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
        maxZoom = 12;
        zoom = 5;
        lat = 0.0;
        lon = 56.0;
    } else if (domain === 'mediterranean') {
        overlays = {
            "Forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'seaLevelPressure'}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'totalCloudCover'}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection'}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst'}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss'})
            }, 
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ
            }
        };
        minZoom = 3;
        maxZoom = 12;
        zoom = 8;
        lat = 35.5;
        lon = 33.9;
    } else {
        throw new Error('Valid domain not specified: ' + domain);
    }

    $(document).ready(function () {
                $.soap({
                    url: 'http://api.fcoo.dk/msi/ws/warning?wsdl',
                    method: 'getActiveWarning',
                    appendMethodToURL: false,
                    soap12: true,
                    data: {
                    },
                
                    success: function (soapResponse, ee, eee) {
                        // do stuff with soapResponse
                        // if you want to have the response as JSON use soapResponse.toJSON();
                        // or soapResponse.toString() to get XML string
                        // or soapResponse.toXML() to get XML DOM
                        console.log(SOAPResponse.toXML());
                        console.log(ee);
                        console.log(eee);
                    },
                    error: function (SOAPResponse, ee, eee) {
                        // show error
                        console.log(SOAPResponse.toXML());
                        console.log(ee);
                        console.log(eee);
                    }
                });
        if (domain === 'denmark_impact') {
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'denmark') {
            var link_template = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003__STATION__:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
            $.getJSON("../json/Observations.json", function (data) {
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
                overlays["Point forecasts"]["Sea level"] = geojson;
                initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
            });
        } else if (domain === 'faroe_islands') {
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'greenland_impact') {
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
                    },
                    /*jshint unused: true*/
                });
                overlays["Point forecasts"]["Tidal forecasts"] = geojson;
                initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
            });
        } else if (domain === 'indian_ocean') {
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'indian_ocean_impact') {
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else if (domain === 'mediterranean') {
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, enablePrint, useGeoMetoc);
        } else {
            throw new Error('Valid domain not specified: ' + domain);
        }
    });

})();
