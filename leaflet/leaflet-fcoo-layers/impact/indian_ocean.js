(function () {
    "use strict";
    /*global L*/

    /**
     * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
     * METOC impact forecast layers leaflet based maps without hassle.
     *
     * This file contains abstractions for showing impact layers for Indian Ocean.
     */
    L.FImpactLayer.replenishment_ecmwf_io = function(options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    sliderOptions: {
                        range: true,
                        step: 1,
                        min: 10,
                        max: 35,
                        values: [ 20, 25 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                        range: true,
                        step: 0.5,
                        min: 1,
                        max: 10,
                        values: [ 4, 5 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.boarding_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
        });
        var legendParams = {
            parameters: {
                windspeed: {
                    longname: 'Wind speed',
                    units: 'm/s',
                    sliderOptions: {
                        range: true,
                        step: 1,
                        min: 10,
                        max: 35,
                        values: [ 18, 20 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                        range: true,
                        step: 0.5,
                        min: 0,
                        max: 6,
                        values: [ 2.5, 3 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.helo_tol_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 40,
                            values: [ 18, 23 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 10,
                            values: [ 3, 4 ],
                    }
                },
                CBH: {
                    longname: 'Cloud base height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 10,
                            min: -300,
                            max: 0,
                            values: [ -150, -60 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.rhib_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 40,
                            values: [ 20, 25 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 10,
                            values: [ 3.5, 5 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.lcp_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 40,
                            values: [ 13, 18 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 6,
                            values: [ 1.5, 2 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.uav_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            values: [ 10, 13 ],
                    }
                },
                CBH: {
                    longname: 'Cloud base height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 10,
                            min: -200,
                            max: 0,
                            values: [ -130, -30 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.skiff_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 30,
                            values: [ 11, 16 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 6,
                            values: [ 1.5, 2 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.dhow_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 30,
                            values: [ 18, 26 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 8,
                            values: [ 2.5, 3 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };

    L.FImpactLayer.fishingboat_120_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 30,
                            values: [ 13, 17 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 8,
                            values: [ 2, 3.5 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };
    L.FImpactLayer.fishingboat_500_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 35,
                            values: [ 19, 23 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 8,
                            values: [ 2.5, 3.5 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };
    L.FImpactLayer.fishingboat_1000_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 40,
                            values: [ 21, 26 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 8,
                            values: [ 3, 4.5 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };
    L.FImpactLayer.fishingboat_2500_ecmwf_io = function (options) {
        var dataset = 'FCOO/IMPACT/IMPACT_ECMWF_AFR_v005C.nc';
        options = L.extend(options, {
            attribution: 'Based on forecasts from <a href="http://ecmwf.org.dk" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>',
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
                            max: 45,
                            values: [ 26, 35 ],
                    }
                },
                SWH: {
                    longname: 'Significant wave height',
                    units: 'm',
                    sliderOptions: {
                            range: true,
                            step: 0.5,
                            min: 0,
                            max: 8,
                            values: [ 4.5, 5.5 ],
                    }
                }
            }
        };
        var layers = Object.keys(legendParams.parameters).join(':');
        var wmsParams = {layers: layers,
                         cmap: 'Green_Red_3colors'};
        return new L.FImpactLayer(dataset, wmsParams, legendParams, options);
    };
}());
