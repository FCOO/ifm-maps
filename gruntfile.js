/***********************************************
gruntfile.js for ifm-maps

https://github.com/FCOO/ifm-maps

***********************************************/

module.exports = function(grunt) {

    "use strict";

    //***********************************************
    grunt.initConfig({
        "fcoo_grunt_plugin":{
            default: {
                "application"   : {
                    "id"            : 0,  //application id. Default=0
                    "name"          : "", //application name. Default="FCOO.dk"

                    "color"         : "", //background-color of favicons. Default="" => blue color of FCOO's logo. Must have format "#123456"
                    "faviconColor"  : "", //Color of the favicon. Default = "" => automatic set to highest contrast to "color" between 'white' and 'blue color of FCOO's logo'

                    "sentryDSN"     : "https://e351388bc0af4cf4a0503ff56dfb9d00@app.getsentry.com/78948" //DSN for Sentry

                },

                "haveJavaScript": true,  //true if the application have js-files
                "haveStyleSheet": true,  //true if the application have css and/or scss-files

                "beforeProdCmd" : "",    //Cmd to be run at the start of prod-task. Multi cmd can be seperated by "&"
                "beforeDevCmd"  : "",    //Cmd to be run at the start of dev-task
                "afterProdCmd"  : "",    //Cmd to be run at the end of prod-task
                "afterDevCmd"   : "",    //Cmd to be run at the end of dev-task

                "DEBUG"         : false  //if true different debugging is on and the tempoary files are not deleted
            }
        }
    });


    //****************************************************************
    //Load grunt-packages
    grunt.loadNpmTasks('grunt-fcoo-grunt-plugin');
};