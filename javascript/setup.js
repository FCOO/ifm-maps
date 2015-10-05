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
    var istore = new L.Control.ImpactLayerStore({language: lang});
    var basemap = "FCOO Standard";
    var langs = ['da', 'en'];
    var useGeoMetoc = false;
    var enablePrint = false;
    var enableWarnings = false;
    var stdOpts;

    if (domain === 'denmark_impact') {
        minZoom = 4;
        maxZoom = 12;
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        stdOpts = {ajaxProxy: proxy, foreground: store.foreground};
        overlays = {
            "Short range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': stdOpts})
            },
            "Short range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
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
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/DENMARK', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': {ajaxProxy: proxy}}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': {ajaxProxy: proxy}}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': {ajaxProxy: proxy}}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': {ajaxProxy: proxy}})
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
                "Firing areas": store.firingAreas
            }
        };
    } else if (domain === 'denmark_impact_land') {
        minZoom = 4;
        maxZoom = 12;
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        stdOpts = {ajaxProxy: proxy};
        overlays = {
            "Impacts": {
                "NBC Smoke": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'nbc_smoke', 'options': stdOpts}),
                "Personnel Land": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'personnel_land', 'options': stdOpts}),
                "Personnel Airborne": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'personnel_airborne', 'options': stdOpts}),
                "Cross Country Manoeuvres": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'cross_country_manoeuvres', 'options': stdOpts}),
                "Bridging": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'bridging', 'options': stdOpts}),
                "Armor Gun Sighting": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'armor_gun_sighting', 'options': stdOpts}),
                "Paradrop": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'paradrop', 'options': stdOpts}),
                "Artillery": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'artillery', 'options': stdOpts}),
                "Air Defence": istore.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'air_defence', 'options': stdOpts}),
            },
            "Forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
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
        zoom = 7;
        lat = 55.7;
        lon = 11.1;
        enablePrint = false;
        enableWarnings = true;
        proxy = WmsAjaxProxy;

        overlays = {
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': {ajaxProxy: proxy}}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
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
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': {ajaxProxy: proxy}}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': {ajaxProxy: proxy}}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': {ajaxProxy: proxy}}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': {ajaxProxy: proxy}}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': {ajaxProxy: proxy}}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': {ajaxProxy: proxy}}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': {ajaxProxy: proxy}}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': {ajaxProxy: proxy}}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': {ajaxProxy: proxy}})
            },
            "Underwater forecasts": {
                "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentSpeed3D', 'options': {ajaxProxy: proxy}}),
                "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentDirection3D', 'options': {ajaxProxy: proxy}}),
                "seatemp": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'temperature3D', 'options': {ajaxProxy: proxy}}),
                "salinity": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'salinity3D', 'options': {ajaxProxy: proxy}})
            },
            "Measurements": {
                "Sea level": new L.GeoJSON.Sealevel()
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ
            }
        };
        proxy.doAjax();
    } else if (domain === 'faroe_islands_impact') {
        stdOpts = {ajaxProxy: proxy, foreground: store.foreground};
        overlays = {
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
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
        langs = ['da', 'en'];
        minZoom = 3;
        maxZoom = 12;
        zoom = 7;
        lat = 61.5;
        lon = -6.0;
    } else if (domain === 'faroe_islands') {
        overlays = {
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
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
        stdOpts = {ajaxProxy: proxy, foreground: store.foreground};
        overlays = {
            "Short range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': stdOpts})
            },
            "Short range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'DMI_FCOO/HIRLAM_WW3/GREENLAND', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Short range forecasts": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover'}),
                "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration'}),
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
            },
            "Medium range impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': stdOpts})
            },
            "Medium range impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/GREENLAND', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Medium range forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
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
                "Tidal predictions": new L.GeoJSON.Tides({'language': lang})
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
                "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation'}),
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
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover'}),
                "iceconcentration": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceConcentration'}),
                "icethickness": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceThickness'}),
                //"icespeed": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceSpeed'}),
                //"icedirection": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceDirection'}),
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
                "Tidal predictions": new L.GeoJSON.Tides({'language': lang})
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
            "Forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
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
                "EEZ": store.EEZ
            }
        };
        minZoom = 4;
        maxZoom = 12;
        zoom = 5;
        lat = 0.0;
        lon = 56.0;
    } else if (domain === 'indian_ocean_impact') {
        stdOpts = {ajaxProxy: proxy, foreground: store.foreground};
        overlays = {
            "Impacts - Own Ops": {
                "Helo": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'helo', 'options': stdOpts}),
                "RHIB": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'RHIB', 'options': stdOpts}),
                "LCP": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'LCP', 'options': stdOpts}),
                "RAS": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'RAS', 'options': stdOpts}),
                "Boarding": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'boarding', 'options': stdOpts}),
                "UAV": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'UAV', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': stdOpts}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': stdOpts})
            },
            "Impacts - Adversary Ops": {
                "Skiff": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'skiff', 'options': stdOpts}),
                "Dhow": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'dhow', 'options': stdOpts}),
                "Fishing:120GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_120', 'options': stdOpts}),
                "Fishing:500GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_500', 'options': stdOpts}),
                "Fishing:1000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_1000', 'options': stdOpts}),
                "Fishing:2000GT": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'fishingboat_2000', 'options': stdOpts}),
                "Generic1": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': {ajaxProxy: proxy}}),
                "Generic2": istore.getLayer({'dataset': 'ECMWF/DXD_DXP/AFR', 'parameter': 'generic', 'options': {ajaxProxy: proxy}})
            },
            "Forecasts": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
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
                "EEZ": store.EEZ
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
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windSpeed'}),
                "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'waveHeight'}),
                "seastate": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'seaState'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'waveDirection'}),
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection'}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst'}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss'})
            }, 
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
            },
            "Static layers": {
                "EEZ": store.EEZ,
            }
        };
        minZoom = 3;
        maxZoom = 12;
        zoom = 5;
        lat = 36.8;
        lon = 20.4;
    } else {
        throw new Error('Valid domain not specified: ' + domain);
    }

    $(document).ready(function () {
        initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, 
                      lat, lon, tilesize, enablePrint, enableWarnings, 
                      useGeoMetoc);
    });

})();
