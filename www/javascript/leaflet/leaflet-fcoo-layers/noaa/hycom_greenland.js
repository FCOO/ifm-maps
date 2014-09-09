/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.Noaa.currentSpeed = function (options) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer.Noaa._currentSpeed('NOAA/HYCOM/NOAA_HYCOM_GREENLAND.nc', options);
                //options = L.extend(options, {legendImagePath: ''});
                //var layer2 = new L.FLayer.Noaa._currentSpeed('metoc.dk.velocities.1nm.surface.1h.NS1C', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Noaa._currentSpeed = function (dataset, options) {
                var currentoptions = {layers: 'u_velocity_v_velocity', cmap: 'Current_kn_GYR_9colors'}
                options = L.extend(options, currentoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / HYCOM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u_velocity_v_velocity&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Current_kn_GYR_9colors';
		}
		return layer;
	};

	L.FLayer.Noaa.currentDirection = function (options) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer.Noaa._currentDirection('NOAA/HYCOM/NOAA_HYCOM_GREENLAND.nc', options);
                //var layer2 = new L.FLayer.Noaa._currentDirection('metoc.dk.velocities.1nm.surface.1h.NS1C', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Noaa._currentDirection = function (dataset, options) {
                var currentoptions = {layers: 'u_velocity:v_velocity'}
                options = L.extend(options, currentoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Noaa.sss = function (options) {
                options = L.extend(options, {attribution: 'Sea surface salinity forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer.Noaa._sss('NOAA/HYCOM/NOAA_HYCOM_GREENLAND.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Noaa._sss = function (dataset, options) {
                var extraoptions = {layers: 'sss', cmap: 'PrSalArctic_psu_GB_17colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / HYCOM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=sss&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=PrSalArctic_psu_GB_17colors';
		}
		return layer;
	};

	L.FLayer.Noaa.sst = function (options) {
                options = L.extend(options, {attribution: 'Sea surface temperature forecasts from <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a>'});
                var layer1 = new L.FLayer.Noaa._sst('NOAA/HYCOM/NOAA_HYCOM_GREENLAND.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Noaa._sst = function (dataset, options) {
                var extraoptions = {layers: 'sst', cmap: 'SeaTempArctic_C_BGYR_13colors'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://noaa.gov" alt="National Oceanic and Atmospheric Administration">NOAA</a> / HYCOM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=sst&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaTempArctic_C_BGYR_13colors';
		}
		return layer;
	};
}());
