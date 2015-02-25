"""
Use Fabric for building and deploying IFM Maps.

Usage (deployment on staging server):

  fab -R staging deploy

or (deployment on production server:

  fab -R production deploy

"""
import datetime, tempfile, shutil, os
from distutils.util import strtobool

from fabric.api import env, local, run, cd, sudo, lcd
from fabric.contrib.files import sed, exists

env.roledefs = {
    'local': ['localhost'],
    'staging': ['ptest@ftp01:23'],
    'production': ['prod@ftp01:23']
}

if not len(env.roles):
    env.roles = ["local"]

env.setups = ['greenland', 'faroe_islands', 'denmark', 
              'mediterranean', 'indian_ocean', 'global']

env.cssfiles = ["bower_components/fontawesome/css/font-awesome.min.css",
                "bower_components/leaflet/dist/leaflet.css",
                "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.css",
                "bower_components/leaflet-languageselector/leaflet-languageselector.css",
                "bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.css",
                "bower_components/leaflet.locatecontrol/dist/L.Control.Locate.css",
                "bower_components/flag-icon-css/css/flag-icon.min.css",
                "bower_components/leaflet-control-position/leaflet-control-position.css",
                "bower_components/leaflet-control-home/leaflet-control-home.css",
                "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.css",
                "javascript/leaflet/leaflet-fcoo-layers.css",
                "javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.css",
                "javascript/leaflet/leaflet-control-datetime.css",
                "javascript/leaflet/L.Control.Print.css",
                "javascript/leaflet/Control.OSMGeocoder.ifm-maps.css",
                "css/ifm-maps.css"]
env.cssfiles_extra = ["bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css"]

env.jsfiles = ["bower_components/jquery-placeholder/jquery.placeholder.js",
               "bower_components/magellan/magellan.js",
               "bower_components/moment/min/moment-with-locales.min.js",
               "bower_components/leaflet/dist/leaflet-src.js",
               "bower_components/leaflet-plugins/control/Permalink.js",
               "bower_components/leaflet-languageselector/leaflet-languageselector.js",
               "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.js",
               "bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.js",
               "bower_components/Leaflet.dbpediaLayer/dist/leaflet.dbpedialayer.js",
               "bower_components/leaflet.locatecontrol/dist/L.Control.Locate.min.js",
               "bower_components/Leaflet.Terminator/L.Terminator.js",
               "bower_components/leaflet-control-position/leaflet-control-position.js",
               "bower_components/leaflet-control-home/leaflet-control-home.js",
               "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.js",
               "javascript/leaflet/Permalink.CategorizedLayer.js",
               "javascript/leaflet/Permalink.CategorizedOverlay.js",
               "javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js",
               "javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.js",
               "javascript/leaflet/leaflet-fcoo-layers/Permalink.ImpactLayer.js",
               "javascript/leaflet/leaflet-control-datetime.js",
               "javascript/leaflet/L.Control.Print.js",
               "javascript/map_common.js"]
env.jsfiles_extra = ["bower_components/jquery/dist/jquery.min.js",
                     "bower_components/jquery-ui/jquery-ui.min.js",
                     "bower_components/noty/js/noty/packaged/jquery.noty.packaged.js"]

env.images = []

def _booleanize(func):
    """Converts minify argument to boolean."""
    def inner(*args, **kwargs):
        print args, kwargs
        if 'minify' in kwargs and not isinstance(kwargs['minify'], (bool, )):
            kwargs['minify'] = bool(strtobool(kwargs['minify']))
        return func(*args, **kwargs)
    return inner

def bower_reinstall():
    bower_prune()
    bower_install()

def bower_prune():
    local('bower prune')
   
def bower_install():
    local('bower install')

@_booleanize
def build_css(minify=True):
    local('mkdir -p dist')
    cssfiles = ' '.join(env.cssfiles)
    cssfile = 'dist/ifm-maps.css'
    local('cat %s > %s' % (cssfiles, cssfile))
    if minify:
        local('yui-compressor -o %s.new %s' % (cssfile, cssfile))
        local('mv %s.new %s' % (cssfile, cssfile))
    # Include files excluded from compression
    cssfiles = env.cssfiles_extra + [cssfile]
    cssfiles = ' '.join(cssfiles)
    local('cat %s > tmp.css && mv tmp.css %s' % (cssfiles, cssfile))

@_booleanize
def build_js(minify=True):
    local('mkdir -p dist')
    setups = {}
    for setup in env.setups:
        rfile = setup + '/index.php'
        setups[setup] = _extract_jsfiles(rfile)
    jsmodels = 'javascript/leaflet/leaflet-fcoo-layers/%(model)s'
    jsfiles = env.jsfiles
    jsfiles_min = env.jsfiles_extra
    for setup in setups:
        print('Processing %s' % setup)
        destdir = 'dist/%s' % setup
        local('mkdir -p %s' % destdir)
        jsfiles_setup = [f % {'setup': setup} for f in jsfiles]
        jsmodels_setup = [jsmodels % {'model': model} for model in setups[setup]]
        jsfiles_setup += jsmodels_setup
        #local('mkdir %s/images' % (setup))
        #local('cp javascript/leaflet/images/* %s/images/.' % (setup))
        #local('cp javascript/jquery-ui-1.11.2.custom/images/* %s/images/.' % (setup))
        jsfilestr = ' '.join(jsfiles_setup)
        jsfile = '%s/ifm-maps.js' % destdir
        local('cat %s > %s' % (jsfilestr, jsfile))
        if minify:
            local('/usr/bin/node /usr/bin/uglifyjs -o %s %s' % (jsfile, jsfile))
        # Include previously compressed files
        jsfiles_all = jsfiles_min + [jsfile]
        jsfilestr = ' '.join(jsfiles_all)
        local('cat %s > tmp.js && mv tmp.js %s' % (jsfilestr, jsfile))

@_booleanize
def build_web():
    local('mkdir -p dist')
    setups = {}
    for setup in env.setups:
        rfile = setup + '/index.php'
        setups[setup] = _extract_jsfiles(rfile)
    for setup in setups:
        print('Processing %s' % setup)
        destdir = 'dist/%s' % setup
        local('mkdir -p %s' % destdir)
        local('cp %s/index.php %s/index-dev.php' % (setup, destdir))
        local('cp %s/index-prod.php %s/index.php' % (setup, destdir))

@_booleanize
def build(minify=True):
    """Minify, concatenate and build distributable files for IFM Maps."""
    build_css(minify=minify)
    build_js(minify=minify)
    build_web()
    """
            print('Processing %s' % setup)
            run('mkdir www/%s/images' % (setup))
            run('cp www/javascript/leaflet/images/* www/%s/images/.' % (setup))
            run('cp www/javascript/jquery-ui-1.11.2.custom/images/* www/%s/images/.' % (setup))
            sed('www/php/common-prod.php',
                'ifm-maps.css',
                'ifm-maps_%s.css' % now)
            sed('www/php/common-prod.php',
                'ifm-maps.js',
                'ifm-maps_%s.js' % now)
    """
    pass

@_booleanize
def deploy(minify=True):
    """Deploy and test IFM Maps."""
    update(minify=minify)

@_booleanize
def update(minify=True):
    """Update IFM Maps with new code and configuration."""
    # Make deployment and configuration directory
    now = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    proj_dir = '/home/%s/DcooWare/ifm-maps-%s' % (env.user, now)
    run('mkdir -p %s' % proj_dir)

    # Checkout code and config stuff
    clone(proj_dir=proj_dir, minify=minify)

    # Test service before finalizing update
    test(proj_dir=proj_dir)

    # Change production symlink to point to new directory
    sym_dir = '/home/%s/ifm-maps' % env.user
    if exists(sym_dir):
        run('rm %s' % sym_dir)
    run('ln -s %s %s' % (proj_dir, sym_dir))

@_booleanize
def clone(proj_dir, minify=True):
    """Clones code and config."""
    now = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    with cd(proj_dir):
        # Clone configuration information into configuration directory
        run('git clone git://git.code.sf.net/p/dcoo/ifm-maps .')
        run('rm -rf .git')
        if 'staging' in env.roles:
            webmap_url = '{s}.fcoo.dk/webmap-staging/{dataset}.wms'
        elif 'production' in env.roles:
            webmap_url = '{s}.fcoo.dk/webmap/{dataset}.wms'
        sed('www/javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js',
            'wms-dev01:8080/\{dataset\}.wms',
            webmap_url)
        
        # Concatenate leaflet css and js files
        cssfiles_min = ['javascript/jquery-ui-1.11.2.custom/jquery-ui.min.css']
        cssfiles = ['javascript/leaflet/leaflet.css',
                    'css/map.css',
                    'css/flag-icon.css',
                    'javascript/leaflet/leaflet-fcoo-layers.css',
                    'javascript/leaflet/leaflet-categorized-layers.src.css',
                    'javascript/leaflet/leaflet-languageselector.css',
                    'javascript/leaflet/leaflet-home.css',
                    'javascript/leaflet/leaflet-control-datetime.css',
                    'javascript/leaflet/leaflet-control-position.css',
                    'javascript/leaflet/L.Control.MousePosition.css',
                    'javascript/leaflet/L.Control.Print.css',
                    'javascript/leaflet/Control.OSMGeocoder.css']
        cssfiles_min = ['www/' + f for f in cssfiles_min]
        cssfiles = ['www/' + f for f in cssfiles]
        jsfiles_min = ['javascript/jquery-1.11.1.js',
                       'javascript/jquery-ui-1.11.2.custom/jquery-ui.js',
                       'javascript/noty-2.2.9/jquery.noty.packaged.min.js']
        jsfiles = ['javascript/date.js',
                   'javascript/moment-with-locales.js',
                   'javascript/magellan.js',
                   'javascript/leaflet/leaflet.js',
                   'javascript/leaflet/leaflet-categorized-layers.src.js',
                   'javascript/leaflet/leaflet-languageselector.js',
                   'javascript/leaflet/leaflet-home.js',
                   'javascript/leaflet/leaflet-celestial/leaflet-celestial.js',
                   'javascript/leaflet/leaflet-celestial/celestial.js',
                   'javascript/leaflet/leaflet-celestial/moon-phase/riset.js',
                   'javascript/leaflet/Permalink.js',
                   'javascript/leaflet/Permalink.CategorizedLayer.js',
                   'javascript/leaflet/Permalink.CategorizedOverlay.js',
                   'javascript/leaflet/L.Terminator.js',
                   'javascript/leaflet/leaflet-flattrbutton.js',
                   'javascript/leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js',
                   'javascript/leaflet/leaflet-control-datetime.js',
                   'javascript/leaflet/leaflet-control-position.js',
                   'javascript/leaflet/L.Control.MousePosition.js',
                   'javascript/leaflet/L.Control.Print.js',
                   'javascript/leaflet/Control.OSMGeocoder.js',
                   'javascript/leaflet/leaflet.dbpedialayer-src.js',
                   'javascript/map_common.js',
                   'javascript/map_%(setup)s.js']
        jsmodels = 'www/javascript/leaflet/leaflet-fcoo-layers/%(model)s'
        jsfiles = ['www/' + f for f in jsfiles]
        jsfiles_min = ['www/' + f for f in jsfiles_min]

        setup_list = ['greenland', 'faroe_islands', 'denmark', 
                      'mediterranean', 'indian_ocean', 'global']
        setups = {}
        for setup in setup_list:
            rfile = 'www/' + setup + '/index.php'
            setups[setup] = _extract_jsfiles(rfile)

        for setup in setups:
            print('Processing %s' % setup)
            jsfiles_setup = [f % {'setup': setup} for f in jsfiles]
            jsmodels_setup = [jsmodels % {'model': model} for model in setups[setup]]
            jsfiles_setup += jsmodels_setup
            run('mv -f www/%s/index.php www/%s/index-dev.php' % (setup, setup))
            run('mv -f www/%s/index-prod.php www/%s/index.php' % (setup, setup))
            run('mkdir www/%s/images' % (setup))
            run('cp www/javascript/leaflet/images/* www/%s/images/.' % (setup))
            run('cp www/javascript/jquery-ui-1.11.2.custom/images/* www/%s/images/.' % (setup))
            cssfilestr = ' '.join(cssfiles)
            jsfilestr = ' '.join(jsfiles_setup)
            cssfile = 'www/%s/ifm-maps_%s.css' % (setup, now)
            jsfile = 'www/%s/ifm-maps_%s.js' % (setup, now)
            run('cat %s > %s' % (cssfilestr, cssfile))
            run('cat %s > %s' % (jsfilestr, jsfile))
            if minify:
                run('uglifyjs -o %s %s' % (jsfile, jsfile))
                run('yui-compressor -o %s.new %s' % (cssfile, cssfile))
            # Include previously compressed files
            cssfiles_all = cssfiles_min + [cssfile]
            jsfiles_all = jsfiles_min + [jsfile]
            cssfilestr = ' '.join(cssfiles_all)
            jsfilestr = ' '.join(jsfiles_all)
            run('cat %s > tmp.css && mv tmp.css %s' % (cssfilestr, cssfile))
            run('cat %s > tmp.js && mv tmp.js %s' % (jsfilestr, jsfile))
            sed('www/php/common-prod.php',
                'ifm-maps.css',
                'ifm-maps_%s.css' % now)
            sed('www/php/common-prod.php',
                'ifm-maps.js',
                'ifm-maps_%s.js' % now)
        # Minify station json file (have to temporarily enclose it in (); to
        # make it valid JavaScript
        #obsfile = 'www/json/Observations.json'
        #run("sed -i '1i(' %s" % (obsfile))
        #run("sed -i '$a);' %s" % (obsfile))
        #run('uglifyjs -o %s %s' % (obsfile, obsfile))
        #run("sed -i 's/^(//' %s" % (obsfile))
        #run("sed -i 's/);$//' %s" % (obsfile))


def test(proj_dir):
    """Test that the code passes unit tests."""
    pass
    #test_dir = proj_dir + '/tests/unit'
    #lib_dir = proj_dir + '/lib:' + proj_dir + '/pythonlibs'
    #with cd(test_dir):
    #    run('export PYTHONPATH=%s && nosetests -x -s --nologcapture .' % lib_dir)

def _extract_jsfiles(rfile):
    """Returns a list of javascript files used in a php index file."""
    output = local("grep '\$model_ids = array' %s" % rfile, capture=True)
    print output
    lines = output.split('\n')
    for line in lines:
        if line.startswith('$model_ids = array'):
            array = line.split('=')[1].strip()
            imps = array.lstrip('array(').rstrip(');')
            js_includes = [imp.strip().strip('"') for imp in imps.split(',')]
            return js_includes
    raise RuntimeError("Could not find php array containing model id's")

