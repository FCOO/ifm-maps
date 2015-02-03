/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC impact forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for showing impact layers for Denmark.
 */

(function () {
	L.FLayer.Impact.boarding = function (options) {
                options = L.extend(options, {
                    attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                    legendParameters: {
                        windspeed: {
                            long_name: 'Wind speed',
                            units: 'm/s',
                            slider_options: {
                                    range: true,
                                    step: 1,
                                    min: 0,
                                    max: 50,
                                    values: [ 10, 25 ],
                            }
                        }
                    }
                });
                var layer1 = new L.FLayer.Impact._boarding('DMI/HIRLAM/MAPS_DMI_S03_v005C.nc', options);
                return layer1;
	};
	L.FLayer.Impact._boarding = function (dataset, options) {
                // Setup expression
                var layers = Object.keys(options['legendParameters']).join(':');
                var baseexpr = '';
                for (var param in options['legendParameters']) {
                    if (baseexpr == '') {
                        baseexpr = 'a_' + param + '*' + param + '+b_' + param;
                    } else {
                        baseexpr = 'fmax(' + baseexpr + ',' + 'a_' + param + '*' + param + '+b_' + param + ')';
                    }
                }
                baseexpr = 'fmin(100,fmax(0,' + baseexpr + '))';
                var extraoptions = {layers: layers,
                                    baseexpr: baseexpr,
                                    cmap: 'Green_Red_10colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FImpactLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = null;
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal,nolabel,noticks&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Green_Red_10colors';
		}
		return layer;
	};

	L.FLayer.Impact.helo_tol = function (options) {
                options = L.extend(options, {
                    attribution: 'Based on forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>',
                    legendParameters: {
                        windspeed: {
                            long_name: 'Wind speed',
                            units: 'm/s',
                            slider_options: {
                                    range: true,
                                    step: 1,
                                    min: 0,
                                    max: 50,
                                    values: [ 10, 20 ],
                            }
                        },
                        VIS: {
                            long_name: 'Visibility',
                            units: 'm',
                            slider_options: {
                                    range: true,
                                    step: 50,
                                    min: -5000,
                                    max: 0,
                                    values: [ -1000, -300 ],
                            }
                        }
                    }
                });
                var layer1 = new L.FLayer.Impact._helo_tol('DMI/HIRLAM/MAPS_DMI_S03_v005C.nc', options);
                return layer1;
	};
	L.FLayer.Impact._helo_tol = function (dataset, options) {
                // Setup expression
                var layers = Object.keys(options['legendParameters']).join(':');
                var baseexpr = '';
                for (var param in options['legendParameters']) {
                    if (baseexpr == '') {
                        baseexpr = 'a_' + param + '*' + param + '+b_' + param;
                    } else {
                        baseexpr = 'fmax(' + baseexpr + ',' + 'a_' + param + '*' + param + '+b_' + param + ')';
                    }
                }
                baseexpr = 'fmin(100,fmax(0,' + baseexpr + '))';
                var extraoptions = {layers: layers,
                                    baseexpr: baseexpr,
                                    cmap: 'Green_Red_10colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FImpactLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = null;
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=windspeed&STYLES=horizontal,nolabel,noticks&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Green_Red_10colors';
		}
		return layer;
	};
}());
