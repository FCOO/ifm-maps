(function ($, L, Raven, window /*, document, undefined*/){
    "use strict";

    // Let raven report all uncaught exceptions to sentry
//Moved to fcoo-leaflet : Raven.config('https://e351388bc0af4cf4a0503ff56dfb9d00@app.getsentry.com/78948').install();

    /**
     * Initialize the map.
     */

    //console.profile('init');
    // Retrieve all URL parameters
    var urlParams = window.getParameters(),
        protocol = window.location.protocol == 'https:' ? 'https:' : 'http:';

    window.domain = null;
    // The domain variable is used to determine which setup to use
    if (urlParams.domain !== undefined) {
        window.domain = urlParams.domain;
    }

    // Initialize minumum and maximum zoom
    var minZoom = 3;
    var maxZoom = 12;

    // We use a proxy for getting overlay information. The proxy
    // merges requests to the same datafile together to one
    // request
    var proxy = window.WmsAjaxProxy;

    var zoom;
    var lat;
    var lon;
    var overlays;
    var overlays1; // For impact maps test
    var overlays2; // For impact maps test
    var lang = window.getLocalLanguage();
    var store = new L.Control.FcooLayerStore({language: lang});
    //var istore = new L.Control.ImpactLayerStore({language: lang});
    var basemap = "FCOO Standard";
    var langs = ['da', 'en'];
    var useGeoMetoc = false;
    var enablePrint = false;
    var stdOpts = {ajaxProxy: proxy};
    var maps;

    // Notify user of outstanding AJAX events and again when everything
    // has loaded
    var numAjaxEvents = 0;
    var notyMessage;
    $(document).ajaxSend(function (/*evt*/) {
        numAjaxEvents += 1;
        if (numAjaxEvents === 1) {
            var msg = window.getI18n('Loading forecast information', lang);
            if (notyMessage === undefined) {
                notyMessage = window.noty({text: msg, type: 'information'});
            } else {
                notyMessage.setText(msg);
                notyMessage.setTimeout(false);
            }
        }
    }).ajaxComplete(function (/*evt*/) {
        numAjaxEvents -= 1;
        if (numAjaxEvents === 0) {
            var msg = window.getI18n('Finished loading forecast information', lang);
            notyMessage.setText(msg);
            notyMessage.setTimeout(1500);
        }
    });

    switch (window.domain){
        //*********************************
        case 'denmark':
            zoom = 7;
            lat = 55.7;
            lon = 11.1;
            enablePrint = false;

            overlays = {
                "Short range forecasts": {
                    "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts}),
                    "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC_MERGED', 'parameter': 'waveDirection', 'options': stdOpts}),
                    "current": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                    "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentSpeed', 'options': stdOpts}),
                    "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'currentDirection', 'options': stdOpts}),
                    "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'seaLevel', 'options': stdOpts}),
                    "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sst', 'options': stdOpts}),
                    "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC_MERGED', 'parameter': 'sss', 'options': stdOpts})
                },
                "Medium range forecasts": {
                    "wind": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection', 'options': stdOpts})
                },
                "Underwater forecasts": {
                    "current": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentDirection3D', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                    "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentSpeed3D', 'options': stdOpts}),
                    "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'currentDirection3D', 'options': stdOpts}),
                    "seatemp": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'temperature3D', 'options': stdOpts}),
                    "salinity": store.getLayer({'dataset': 'FCOO/GETM/DK_MERGED', 'parameter': 'salinity3D', 'options': stdOpts})
                },
                "Measurements": {
                    "Sea level": new L.GeoJSON.Sealevel({'url':'data/sealevel_stations_denmark.json'})
                },
                "Safety": {
                    "MSI": new L.GeoJSON.MSI({
                        language: lang,
                        protocol: protocol
                    }),
                    "Firing warnings": L.layerGroup([new L.GeoJSON.Fwarn({language: lang, protocol: protocol}), store.getFiringAreas()])
                },
                "Celestial information": {
                    "Solar Terminator": store.getSolarTerminator()
                },
                "Static layers": {
                    "EEZ": store.getEEZ(),
                }
            };
            break;

        //*********************************
        case 'faroe_islands':
            overlays = {
                "Short range forecasts": {
                    "wind": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection', 'options': stdOpts}),
                    "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection', 'options': stdOpts})
                },
                "Medium range forecasts": {
                    "wind": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection', 'options': stdOpts}),
                    "current": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                    "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed', 'options': stdOpts}),
                    "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts}),
                    "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst', 'options': stdOpts}),
                    "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss', 'options': stdOpts})
                },
                "Celestial information": {
                    "Solar Terminator": store.getSolarTerminator()
                },
                "Static layers": {
                    "EEZ": store.getEEZ(),
                }
            };
            langs = ['da', 'fo', 'en'];
            zoom = 7;
            lat = 61.5;
            lon = -6.0;
            break;

        //*********************************
        case 'greenland':
            zoom = 6;
            lat = 62.0;
            lon = -45.0;
            overlays = {
                "Short range forecasts": {
                    "wind": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection', 'options': stdOpts}),
                    "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection', 'options': stdOpts})
                },
                "Medium range forecasts": {
                    "wind": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "iceconcentration": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceConcentration', 'options': stdOpts}),
                    "icethickness": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceThickness', 'options': stdOpts}),
                    //"icespeed": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceSpeed', 'options': stdOpts}),
                    //"icedirection": store.getLayer({'dataset': 'STENNIS/ACNFS_ICE/GREENLAND', 'parameter': 'iceDirection', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection', 'options': stdOpts}),
                    "current": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                    "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed', 'options': stdOpts}),
                    "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection', 'options': stdOpts}),
                    "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst', 'options': stdOpts}),
                    "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss', 'options': stdOpts})
                },
                "Point forecasts": {
                    "Tidal predictions": new L.GeoJSON.Tides({'language': lang, 'url': 'data/tidal_stations_greenland.json'})
                },
                "Celestial information": {
                    "Solar Terminator": store.getSolarTerminator()
                },
                "Static layers": {
                    "EEZ": store.getEEZ(),
                    "SAR": store.getSAR()
                }
            };
            break;

        //*********************************
        case 'indian_ocean':
            overlays = {
                "Forecasts": {
                    "wind": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection', 'options': stdOpts}),
                    "current": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                    "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed', 'options': stdOpts}),
                    "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection', 'options': stdOpts}),
                    "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst', 'options': stdOpts}),
                    "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss', 'options': stdOpts})
                },
                "Celestial information": {
                    "Solar Terminator": store.getSolarTerminator()
                },
                "Static layers": {
                    "EEZ": store.getEEZ()
                }
            };
            zoom = 5;
            lat = 0.0;
            lon = 56.0;
            break;

        //*********************************
        case 'mediterranean':
            overlays = {
                "Forecasts": {
                    "wind": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'windDirection', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/MEDITERRANEAN', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/MEDITERRANEAN', 'parameter': 'waveDirection', 'options': stdOpts}),
                    "current": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver2'}, legendParams: {show: true}}),
                    "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed', 'options': stdOpts}),
                    "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection', 'options': stdOpts}),
                    "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst', 'options': stdOpts}),
                    "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss', 'options': stdOpts})
                },
                "Celestial information": {
                    "Solar Terminator": store.getSolarTerminator()
                },
                "Static layers": {
                    "EEZ": store.getEEZ(),
                }
            };
            zoom = 5;
            lat = 36.8;
            lon = 20.4;
            break;

        //*********************************
        case 'europe':
            overlays = {
                "Forecasts": {
                    "wind": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=color_quiver1,vector_spacing=80,vector_offset=20'}, legendParams: {show: true}}),
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'windSpeed', 'options': stdOpts}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'windDirection', 'options': stdOpts, wmsParams: {styles: 'vector_method=black_vector,vector_spacing=80,vector_offset=20'}}),
                    "windbarbs": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'windDirection', 'options': stdOpts}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'seaLevelPressure', 'options': stdOpts}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'totalPrecipitation', 'options': stdOpts}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'airTemperature', 'options': stdOpts}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/ATLANTIC', 'parameter': 'totalCloudCover', 'options': stdOpts}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/ATLANTIC', 'parameter': 'wavePeriod', 'options': stdOpts}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/ATLANTIC', 'parameter': 'waveHeight', 'options': stdOpts}),
                    "seastate": store.getLayer({'dataset': 'ECMWF/DXP/ATLANTIC', 'parameter': 'seaState', 'options': stdOpts}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/ATLANTIC', 'parameter': 'waveDirection', 'options': stdOpts})
                },
                "Celestial information": {
                    "Solar Terminator": store.getSolarTerminator()
                },
                "Static layers": {
                    "EEZ": store.getEEZ(),
                }
            };
            zoom = 4;
            lat = 55.0;
            lon = -18.0;
            break;

        //*********************************
        default:
            var hash = window.location.hash.slice(1),
                search = window.location.search,
                href = window.location.href,
                hrefArray = href.split('/');
                hrefArray.pop();
                hrefArray.push('select');
                hrefArray.push('index.html');

            window.location.href = hrefArray.join('/') + search + (hash ? '#' + hash : ''); 
            return;
            //throw new Error('Valid domain not specified: ' + window.domain);
    } //end of switch (window.domain){

    
    
    // Construct maps
    maps = {
        map: {
            overlays: overlays
        }
    };

    // Hardcoded for impact sync test
    if (window.domain === 'denmark_impact_sync') {
        urlParams.multimaps = '2x1';
    }

    // Make multiple viewports if requested
    var multimaps = [];
    if (urlParams.multimaps !== undefined) {
        multimaps = urlParams.multimaps.split('x');
        var nx = parseInt(multimaps[0]);
        var ny = parseInt(multimaps[1]);
        var ntot = nx*ny;

        var dx = 100.0 / nx - 1.0;
        var dy = 100.0 / ny - 1.0;
        var mapobj = $('#map');
        var newmaps = {};
        var submapIDs = [];
        for (var i=0; i<ntot; i++) {
            submapIDs[i] = 'map' + (i+1);
        }
        $.each(submapIDs, function(index, submapID) {
            var submap = $('<div/>');
            submap.addClass('map-container');
            submap.attr('id', submapID);
            submap.width(dx + '%');
            submap.height(dy + '%');
            mapobj.append(submap);
            newmaps[submapID] = maps.map;
        });
        maps = newmaps;
    }

    // Hardcoded for impact sync test
    if (window.domain === 'denmark_impact_sync') {
        // Construct maps
        maps = {
            map1: {
                overlays: overlays1
            },
            map2: {
                overlays: overlays2
            }
        };
    }

    // Retrieve overlay metainformation
    proxy.doAjax();

    // Init map
    var mapStore = window.initCommonMap(store, langs, maps, enablePrint);
    //console.profileEnd();

    $(document).ready(function () {
        //console.profile('ready');
        window.createCommonMap(store, basemap, maps, minZoom, maxZoom, zoom, lat, lon, enablePrint, useGeoMetoc, mapStore);
        //console.profileEnd();

    });

})(jQuery, L, Raven, this, document);
