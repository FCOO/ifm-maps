<!DOCTYPE html>
<html>
<head>
    <title>Information for Mariners Maps - <?php echo $domain_name ?></title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="ifm-maps.css" />
    <link rel="stylesheet" type="text/css" href="../fonts/font-awesome-4.1.0/css/font-awesome.min.css" />
</head>
<body>
    <div id="map"></div>
    <script src="ifm-maps.js"></script>
    <script>window.L_PREFER_CANVAS = true;</script>
    <!--[if lt IE 9]><script type="text/javascript" src="../javascript/polyfills/excanvas.js"></script><![endif]-->
    <!--[if lt IE 10]><script type="text/javascript" src="../javascript/polyfills/typedarray.js"></script><![endif]-->
    <script>initMap();</script>
</body>
</html>
