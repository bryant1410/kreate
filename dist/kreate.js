/*!
 * Kreate.js
 * A tiny element creator plugin for jQuery. This plugin was inspired by the .create() method from the Zest.js library.
 * v0.0.5 (https://github.com/ItsJonQ/kreate)
 * Copyright 2014 Jon Q
 * Licensed under MIT (https://github.com/itsjonq/kreate/blob/master/LICENSE)
 */

(function ($, undefined) { "use strict";

    // Return false if jQuery is not defined or valid
    if(!$ || typeof jQuery !== "function") {
        return false;
    }

    // Defining kreate variable
    var kreate;

    /**
     * kreate
     * Defining and creating the kreate method for jQuery. The
     * method can be triggered by executing:
     *
     * $.kreate()
     *
     * @param  { string / object } options [ settings for the plugin ]
     * @param  { number } length  [ the number of elements to create ]
     * @param  { string } output  [ the type of output ]
     * @return { jQuery object / string / array }
     */
    kreate = function(options, length, output) {
        // Defining variables to cache to type of the options argument
        var isString = typeof options === "string";
        var isObject = typeof options === "object";

        // Options must be defined
        // Options must be either a string or an object
        if( !options && !( isString || isObject ) ) {
            // Return a jQuery object with a div
            return this(document.createElement('div'));
        }

        /**
         * els
         * This is the array/collection were the generated HTML elements
         * will be pushed to.
         *
         * @type {Array}
         */
        var els = [];

        /**
         * _selectorRegex
         * This is used to parse a string to determine the selector,
         * id, and class to create a single element
         * @type {RegExp}
         */
        var _selectorRegex = /#([\w-]+)|\.([\w-]+)/;

        /**
         * Defining the settings
         * These are the default settings/options for the plugin
         */
        var settings;
        // Defining the default tagName
        var tagName = "div";


        /**
         * "Express" Kreation Parsing
         * This allows the user to quickly Kreate elements using a string as
         * the options argument instead of an object.
         *
         * Example: $.kreat('div.thumbnail');
         *
         * TODO: Look into Emmet / ZenCoding string parsing for easier and
         * more powerful element creation.
         */

        // Define the settings if the options is a string
        if(isString) {
            // If the string contains a space
            if(options.indexOf(" ") >= 0) {
                // Return and execute jQuery init
                return this(options);
            }

            // Regex the options using .split
            var match = options.split(_selectorRegex);
            // Regex breakdown for $.kreate('div#id.classname');
            // ["div", "id", undefined, "", undefined, "classname", ""]

            // Setting options as object, and passing parsed selector, class,
            // id, and length
            options = {
                tag: match[0] ? match[0] : tagName,
                id: match[1] ? match[1] : null,
                class: match[2] ? match[2] : match[5],
                length: (length && typeof length === "number") ? length : 1
            };
        }

        // Setting the options object output if applicable
        options.output = (output && typeof output === "string") ? output : "jquery";


        /**
         * Defining the Settings
         *
         * This is the default object used by the "Advance" Kreation method.
         * A "settings" object will be made/used in the creation proess,
         * whether the user chooses to Kreate with a string (Express)
         * or an object (Advanced).
         *
         * @type {[type]}
         */
        settings = $.extend({
            tag: tagName,
            id: "",
            attr: {},
            content: "",
            class: "",
            length: 1,
            uniqueId: true,
            startId: 1,
            output: "jquery"
        }, options);

        // Ensure that the length is a number
        if(typeof settings.length !== "number") {
            // Set the length as 1 as default
            settings.length = 1;
        }

        // Ensure that the startId is a number
        if(typeof settings.startId !== "number") {
            // Set the startId as 1 as default
            settings.startId = 1;
        }

        // Convert the settings.output to lowercase
        settings.output = settings.output.toLowerCase();
        // Ensuring settings.output is set properly
        if( !(  settings.output === "jquery" ||
                settings.output === "html" ||
                settings.output === "array" ) ) {
            settings.output = "jquery";
        }


        /**
         * Creating the Elements
         * Creating and pushing the elements to the els array to output
         * the jQuery object
         */
        // Defining the attributes from the settings
        var attr = settings.attr;

        // Defining the loop variables
        var i = 0;
        var len = settings.length;

        // Looping through the length (amount) of elements the user chooses
        // to Kreate
        for( ; i < len; i++) {
            // Creating the element
            var el = document.createElement(settings.tag);

            // Set the class of the element
            if(settings.class) {
                el.className = settings.class;
            }
            // Set the ID of the element
            if(settings.id) {

                /**
                 * ID Numeration
                 * If the user chooses to create multiple elements and an ID
                 * is defined, Kreate will automatically add numeration
                 * to the ID to prevent duplicates
                 */
                if(len > 1 && settings.uniqueId === true) {
                    // Setting the numerated ID
                    el.id = settings.id + "-" + (settings.startId + i);
                } else {
                    // Setting the ID without numeration
                    el.id = settings.id;
                }
            }
            // Set the attributes
            if(typeof attr === "object" && !$.isEmptyObject(attr)) {
                // Looping through the settings.attr
                for(var key in attr) {
                    // if attr has a valid property of key
                    if (attr.hasOwnProperty(key)) {
                        // Set the attribute on el
                        el.setAttribute(key, attr[key]);
                    }
                }
            }
            // Adding the Content to the element
            if(settings.content && typeof settings.content === "string") {
                // Setting the innerHTML of the el
                el.innerHTML = settings.content;
            }

            // Push it to els array
            els.push(el);
        }


        /**
         * Outputting the newly Kreated elements
         *
         * By default, Kreate will output a jQuery object. However, the
         * user can also output Kreated elements as an HTML string,
         * or as an array.
         */

        // Return jQuery object if els array has elements in it
        if(els.length > 0) {
            // Return the jQuery object with the newly created elements
            if(settings.output === "jquery") {
                // Returning $() with the array of elements
                return this(els);
            }

            // Return the HTML string of newly created elements
            if(settings.output === "html") {
                // Defining HTML
                var html = "";
                // Define loop variables
                i = 0;
                len = els.length;
                // Loop through els
                for( ; i < len; i++) {
                    // Add the outer HTML of the els to html string
                    html += els[i].outerHTML;
                }
                // Return the HTML
                return html;
            }

            // Return the newly created elements as an array
            if(settings.output === "array") {
                // Return the array
                return els;
            }

        } else {
            // Return jQuery
            return this(options);
        }

    };

    // Adding kreate to jQuery
    jQuery.kreate = kreate;

})(jQuery);