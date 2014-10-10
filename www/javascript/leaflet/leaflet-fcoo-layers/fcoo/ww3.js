/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.Fcoo.waveHeight = function (options, domain) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'NSBaltic':
                        layer = L.FLayer.Fcoo._waveHeight('FCOO/WW3/ww3fcast_grd_NSBaltic_v006C.nc', options);
                        break;
                    case 'DKinner':
                        layer = L.FLayer.Fcoo._waveHeight('FCOO/WW3/ww3fcast_grd_DKinner_v006C.nc', options);
                        break;
                    case 'Greenland':
                        layer = L.FLayer.Fcoo._waveHeight('FCOO/WW3/WW3_Arctic_geo9nm_v001C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing wave height for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
	};
	L.FLayer.Fcoo._waveHeight = function (dataset, options) {
                var waveoptions = {layers: 'u_v', cmap: 'Hs_m_GBP_20colors'}
                waveoptions = L.extend(waveoptions, options);
		var layer = new L.FLayer(dataset, waveoptions);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u_v&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Hs_m_GBP_20colors';
		}
		return layer;
	};

	L.FLayer.Fcoo.waveDirection = function (options, domain) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'NSBaltic':
                        layer = L.FLayer.Fcoo._waveDirection('FCOO/WW3/ww3fcast_grd_NSBaltic_v006C.nc', options);
                        break;
                    case 'DKinner':
                        layer = L.FLayer.Fcoo._waveDirection('FCOO/WW3/ww3fcast_grd_DKinner_v006C.nc', options);
                        break;
                    case 'Greenland':
                        layer = L.FLayer.Fcoo._waveDirection('FCOO/WW3/WW3_Arctic_geo9nm_v001C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing wave direction for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
	};
	L.FLayer.Fcoo._waveDirection = function (dataset, options) {
                var waveoptions = {layers: 'u:v', styles: 'black_vector,0.5'}
                waveoptions = L.extend(waveoptions, options);
		var layer = new L.FLayer(dataset, waveoptions);
		return layer;
	};

	L.FLayer.Fcoo.wavePeriod = function (options, domain) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'NSBaltic':
                        layer = L.FLayer.Fcoo._wavePeriod('FCOO/WW3/ww3fcast_grd_NSBaltic_v006C.nc', options);
                        break;
                    case 'DKinner':
                        layer = L.FLayer.Fcoo._wavePeriod('FCOO/WW3/ww3fcast_grd_DKinner_v006C.nc', options);
                        break;
                    case 'Greenland':
                        layer = L.FLayer.Fcoo._wavePeriod('FCOO/WW3/WW3_Arctic_geo9nm_v001C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing wave period for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
	};
	L.FLayer.Fcoo._wavePeriod = function (dataset, options) {
                var opts = {layers: 'TMN', cmap: 'MeanPeriod_s_RGB_19colors'};
                wms_opts = L.extend({}, opts);
                wms_opts = L.extend(wms_opts, options);
                var layer = new L.FLayer(dataset, wms_opts);
                if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3';
                        var params = L.extend({}, layer.defaultLegendParams);
                        params = L.extend(params, opts);
                        layer.options.legendImagePath = layer._fcootileurl + '?' + $.param(params);
                }
                return layer;
	};
}());
