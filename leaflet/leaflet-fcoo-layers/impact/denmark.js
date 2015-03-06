/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC impact forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for showing impact layers for Denmark.
 */

(function () {
    L.FImpactLayer.replenishment = function(options) {
        var dataset = 'FCOO/MERGED/impact.nc';
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

    L.FImpactLayer.boarding = function (options) {
        var dataset = 'FCOO/MERGED/impact.nc';
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

    L.FImpactLayer.helo_tol = function (options) {
        var dataset = 'FCOO/MERGED/impact.nc';
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
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 100,
                            min: -6000,
                            max: 0,
                            values: [ -4000, -2000 ],
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
