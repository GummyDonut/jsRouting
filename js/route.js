define ('route', [], function() {

    var Router = {
        
        routes : [],
        
        mode: null,

        root :  "/",

        /**
        * Push js route object into routes array
        * @param regex  - <Regex> regular expression used to generate the routeA
        * @param template - <String> file name of the template
        * @param partial - <String> file name for the partial we want to add
        * @param handler - <function> run this function when the route is entered
        */
        add : function (regex,template, partial, handler) {
            
            // alias
            var self = this;

            if (typeof regex == 'function') {
                handler = regex;
                regex = '';
            }
        
            self.routes.push ({
                regex : regex,
                handler : handler,
                template : template,
                partial : partial
            });

            return self;
        },

        /**
        * Loop through every route inside the array check if it matches to regex
        * if so remove it
        * @param param - <Regex> | <function> - identifier used to indicate the route in which we are adding
        */
        remove : function(param) {
            
            // alias
            var self = this;
            
            for (var i = 0; i < self.routes.length; i++) {
                var route = self.routes[i];
                if (route.handler == param || route.regex.toString() == param.toString()) {
                    self.routes.splice(i, 1);
                    return self;
                }
            }

        }, 
        
        /**
        * Reset router setting to defaults
        */
        flush : function() {
        
            // alias
            var self = this;

            self.routes = {};
            self.mode = null;
            self.root = '/';
            return self;
        },

        /**
        * Get the file and load the content in the location based on the type
        * @param filename - <String> Name of the file in which we want to retrieve
        * @param type - <String> "template" or "partials"
        */
        getFileAndLoadContent : function(filename, type) {
        
            // alias
            var self = this;

            var validTypes = ['template', 'partials'];

            if(validTypes.indexOf(type) < 0)
                return false;
                
            var xhr= new XMLHttpRequest();
            xhr.open('GET', type + '/' + filename + '.html', true);
            xhr.onreadystatechange = function() {
                if (this.readyState !== 4) return;
                    if (this.status !== 200) return; // or whatever error handling you want
                        document.getElementById('content').innerHTML= this.responseText;
            };
            xhr.send();
        },

        /**
        * Go through every route and check whether this route exists
        * @param param - <Regex> - check whether this route exists
        */
        check : function(param) {

            // alias
            var self = this;

            var fragment = ( param || self.getURLFragment() );

            for ( var i = 0; i < self.routes.length; i++ ) {
                var match = fragment.match(self.routes[i].regex);
                if ( match ) {
                    
                    var matchingRoute = self.routes[i];

                    match.shift();
                    matchingRoute.handler.apply( {}, match);
                    
                    return this;
                }
            }

            return this;
        },

        listen : function() {
        
            // alias
            var self = this;

            var current = self.getURLFragment();
            var fn = function() {
                if ( current !== self.getURLFragment() ) {
                
                    current = self.getURLFragment();
                    self.check(current);
                }
            }
            clearInterval(this.interval);
            this.interval = setInterval(fn,50);
            return this;

        },
        
        /**
        * Navigate to a specific route
        */
        navigate: function(path) {
            
            path = path ? path : '';
         
            if (this.mode === 'history') {
                 history.pushState(null, null, this.root + this.clearSlashes(path));
            } else {
                 window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
            }
            
            return this;
        },

        /**
        * Configues the routers base settings
        * @param options - <JSON Object> 
        *     mode - <string> - indicate which type of url parsing we are doing
        *     root - <string> - containing the domain in which we wish
        */
        config : function(options) {
            
            // alias
            var self = this;

            // Note that double exclamation mark completely turn code into bool
            self.mode = ( options && options.mode && options.mode == 'history' && !!(history.pushState) ) ? 'history' : 'hash';

            self.root = ( options && options.root ) ? '/'  + self.clearSlashes(options.root) + '/' : '/'; 

            return self;
        },
        
        /**
        * Returns the fragment from the url
        * removing the domain and the parameter
        */
        getURLFragment : function() {
            
            // alias
            var self = this;

            var fragment = '';

            if (self.mode == 'history') {
                fragment = self.clearSlashes(decodeURI(location.pathname + location.search));
                fragment = fragment.replace(/\?(.*)$/, '');
                fragment = ( this.root != '/') ? fragment.replace(this.root, '') : fragment;
            } else  {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }

            return self.clearSlashes(fragment);
        },

        /**
        * Removes the beginning and ending slash
        * @param path - <String> - containing the route or url we want to edit
        */
        clearSlashes : function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        }
    };

    window.Route = Router;

    return Router;
});
