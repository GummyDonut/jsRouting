define('main', ['route'], function(Route) {

    var module = {
    
        'init': function() {

            // alias
            var self = this;

            self.initRouter();
        
        },

        /**
        * initialize router settings for the app
        */
        'initRouter' : function() {
        
            // alias
            var self = this;

            // For some reason hash, only works - look into this
            // Get history mode in html5 to work
            Route.config({ mode: 'hash', root : "/templates/route/"});
            
            Route.add(
                'about', 
                null,
                null,
                function() { 
                    console.log('about');   
                }
            ).listen();

            // when the app starts check the route to make sure what we have
            // route and run content
            Route.check();

        }, 
    
    }

    return module;


});
