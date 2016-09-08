requirejs.config({

    // configure the base route in which we can call
    // js files simply called by their name without the extension
    baseUrl: 'js',

    // list of files that do not work with the require setup
    shims : {

    },

    // list of require ready file that simply fall under a different path
    paths: {
        
    }
});


require(['main'], function(Main) {
    Main.init();
});
