<!DOCTYPE html>
<html>
<head>
	<title>Information for Mariners Maps - <?php echo $domain_name ?></title>
	<meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" type="text/css" href="../bower_components/fontawesome/css/font-awesome.css">
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet/dist/leaflet.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-languageselector/leaflet-languageselector.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.css" />
        <link rel="stylesheet" type="text/css" href="../bower_components/leaflet.locatecontrol/dist/L.Control.Locate.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/flag-icon-css/css/flag-icon.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-control-position/leaflet-control-position.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-control-home/leaflet-control-home.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-control-datetime/leaflet-control-datetime.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-control-legend/leaflet-control-legend.css" />
	<link rel="stylesheet" type="text/css" href="../bower_components/leaflet-control-forecast-print/leaflet-control-forecast-print.css" />
	<!---<link rel="stylesheet" type="text/css" href="../leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.css" />-->
        <link rel="stylesheet" type="text/css" href="../leaflet/Control.OSMGeocoder.ifm-maps.css" />
	<link rel="stylesheet" type="text/css" href="../css/ifm-maps.css" />
        <script>window.L_PREFER_CANVAS = true;</script>
</head>
<body>
	<div id="map"></div>
	<!--[if lt IE 10]><script type="text/javascript" src="../bower_components/typedarray/index.js"></script><![endif]-->
	<script src="../bower_components/jquery/dist/jquery.js"></script>
        <script src="../bower_components/jquery-ui/jquery-ui.js"></script>
        <script src="../bower_components/noty/js/noty/packaged/jquery.noty.packaged.js"></script>
        <script src="../bower_components/jquery-placeholder/jquery.placeholder.js"></script>
	<script src="../bower_components/magellan/magellan.js"></script>
	<script src="../bower_components/moment/min/moment-with-locales.js"></script>
	<script src="../bower_components/leaflet/dist/leaflet-src.js"></script>
	<script src="../bower_components/leaflet-plugins/control/Permalink.js"></script>
	<script src="../bower_components/leaflet-languageselector/leaflet-languageselector.js"></script>
	<script src="../bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.js"></script>
	<script src="../bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.js"></script>
	<script src="../bower_components/Leaflet.dbpediaLayer/dist/leaflet.dbpedialayer.js"></script>
        <script src="../bower_components/leaflet.locatecontrol/src/L.Control.Locate.js"></script>
	<script src="../bower_components/Leaflet.Terminator/L.Terminator.js"></script>
	<script src="../bower_components/leaflet-control-position/leaflet-control-position.js"></script>
	<script src="../bower_components/leaflet-control-home/leaflet-control-home.js"></script>
	<script src="../bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.js"></script>
	<script src="../bower_components/leaflet-control-datetime/leaflet-control-datetime.js"></script>
	<script src="../bower_components/leaflet-tilelayer-counting/leaflet-tilelayer-counting.js"></script>
	<script src="../bower_components/leaflet-control-legend/leaflet-control-legend.js"></script>
	<script src="../bower_components/leaflet-tilelayer-wms-fcoo/leaflet-tilelayer-wms-model.js"></script>
	<script src="../bower_components/leaflet-tilelayer-wms-fcoo/leaflet-tilelayer-wms-fcoo.js"></script>
	<script src="../bower_components/leaflet-control-forecast-print/leaflet-control-forecast-print.js"></script>
	<script src="../leaflet/Permalink.CategorizedLayer.js"></script>
	<script src="../leaflet/Permalink.CategorizedOverlay.js"></script>
	<!---<script src="../leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.js"></script>-->
	<!---<script src="../leaflet/leaflet-fcoo-layers/Permalink.ImpactLayer.js"></script>-->
	<script src="../javascript/map_<?php echo $domain_id ?>.js"></script>
        <script src="../javascript/lang.js"></script>
        <script src="../javascript/url.js"></script>
        <script src="../javascript/map_common.js"></script>
</body>
</html>
