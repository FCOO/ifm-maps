/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC impact forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for showing impact layers for Denmark.
 */

(function () {
	L.FLayer.Impact.replenishment = function (options) {
                options = L.extend(options, {
                    attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                    legendParameters: {
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
                        }
                    }
                });
                var layer1 = new L.FLayer.Impact._replenishment('FCOO/MERGED/impact.nc', options);
                //var layer1 = new L.FLayer.Impact._replenishment('DMI/HIRLAM/MAPS_DMI_S03_v005C.nc', options);
                return layer1;
	};
	L.FLayer.Impact._replenishment = function (dataset, options) {
                // Setup expression
                var layers = Object.keys(options['legendParameters']).join(':');
                var extraoptions = {layers: layers,
                                    cmap: 'Green_Red_3colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FImpactLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = null;
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal,nolabel,noticks&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Green_Red_3colors';
		}
		return layer;
	};

	L.FLayer.Impact.boarding = function (options) {
                options = L.extend(options, {
                    attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                    legendParameters: {
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
                });
                var layer1 = new L.FLayer.Impact._boarding('FCOO/MERGED/impact.nc', options);
                //var layer1 = new L.FLayer.Impact._boarding('DMI/HIRLAM/MAPS_DMI_S03_v005C.nc', options);
                return layer1;
	};
	L.FLayer.Impact._boarding = function (dataset, options) {
                // Setup expression
                var layers = Object.keys(options['legendParameters']).join(':');
                var extraoptions = {layers: layers,
                                    cmap: 'Green_Red_3colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FImpactLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = null;
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal,nolabel,noticks&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Green_Red_3colors';
		}
		return layer;
	};

	L.FLayer.Impact.helo_tol = function (options) {
                options = L.extend(options, {
                    attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                    legendParameters: {
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
                });
                var layer1 = new L.FLayer.Impact._helo_tol('FCOO/MERGED/impact.nc', options);
                //var layer1 = new L.FLayer.Impact._helo_tol('DMI/HIRLAM/MAPS_DMI_S03_v005C.nc', options);
                return layer1;
	};
	L.FLayer.Impact._helo_tol = function (dataset, options) {
                // Setup expression
                var layers = Object.keys(options['legendParameters']).join(':');
                var extraoptions = {layers: layers,
                                    cmap: 'Green_Red_3colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FImpactLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = null;
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal,nolabel,noticks&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Green_Red_3colors';
		}
		return layer;
	};
}());
