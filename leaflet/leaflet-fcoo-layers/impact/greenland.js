/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC impact forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for showing impact layers for Denmark.
 */

(function () {
    L.FImpactLayer.replenishment_ecmwf_gl = function(options) {
        var dataset = 'FCOO/MERGED/IMPACT_ECMWF_GREENLAND_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    attribution: '<a href="http://ecmwf.org">ECMWF</a>',
                    sliderOptions: {
                        range: true,
                        step: 1,
                        min: 0,
                        max: 25,
                        values: [ 10, 15 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    attribution: '<a href="http://ecmwf.org">ECMWF</a>',
                    sliderOptions: {
                        range: true,
                        step: 0.25,
                        min: 0,
                        max: 10,
                        values: [ 2.5, 4 ],
                    }
                }
            }
        }
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'}
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.boarding_ecmwf_gl = function (options) {
        var dataset = 'FCOO/MERGED/IMPACT_ECMWF_GREENLAND_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    attribution: '<a href="http://ecmwf.org">ECMWF</a>',
                    sliderOptions: {
                        range: true,
                        step: 0.5,
                        min: 0,
                        max: 25,
                        values: [ 8, 13 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    attribution: '<a href="http://ecmwf.org">ECMWF</a>',
                    sliderOptions: {
                        range: true,
                        step: 0.25,
                        min: 0,
                        max: 6,
                        values: [ 1.25, 2.5 ],
                    }
                }
            }
        }
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'}
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.helo_tol_ecmwf_gl = function (options) {
        var dataset = 'FCOO/MERGED/IMPACT_ECMWF_GREENLAND_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    attribution: '<a href="http://ecmwf.org">ECMWF</a>',
                    sliderOptions: {
                            range: true,
                            step: 1,
                            min: 0,
                            max: 25,
                            values: [ 10, 15 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    attribution: '<a href="http://ecmwf.org">ECMWF</a>',
                    sliderOptions: {
                            range: true,
                            step: 0.25,
                            min: 0,
                            max: 10,
                            values: [ 2.5, 4 ],
                    }
                }
            }
        }
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'}
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.replenishment_gl = function(options) {
        var dataset = 'FCOO/MERGED/impact_gl.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    attribution: '<a href="dmi.dk">DMI</a>',
                    sliderOptions: {
                        range: true,
                        step: 1,
                        min: 0,
                        max: 25,
                        values: [ 10, 15 ],
                    }
                },
                u_v: {
                    longname: 'Significant wave height',
                    units: 'm',
                    attribution: '<a href="dmi.dk">DMI</a>',
                    sliderOptions: {
                        range: true,
                        step: 0.25,
                        min: 0,
                        max: 10,
                        values: [ 2.5, 4 ],
                    }
                }
            }
        }
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'}
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.boarding_gl = function (options) {
        var dataset = 'FCOO/MERGED/impact_gl.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    sliderOptions: {
                        range: true,
                        step: 0.5,
                        min: 0,
                        max: 25,
                        values: [ 8, 13 ],
                    }
                },
                u_v: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                        range: true,
                        step: 0.25,
                        min: 0,
                        max: 6,
                        values: [ 1.25, 2.5 ],
                    }
                }
            }
        }
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'}
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.helo_tol_gl = function (options) {
        var dataset = 'FCOO/MERGED/impact_gl.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    sliderOptions: {
                            range: true,
                            step: 1,
                            min: 0,
                            max: 25,
                            values: [ 10, 15 ],
                    }
                },
                u_v: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.25,
                            min: 0,
                            max: 10,
                            values: [ 2.5, 4 ],
                    }
                },
                VIS: {
                    longname: 'Visibility',
                    units: 'km',
                    sliderOptions: {
                            range: true,
                            step: 0.1,
                            min: -6,
                            max: 0,
                            values: [ -4, -2 ],
                    }
                }
            }
        }
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'}
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };
}());
