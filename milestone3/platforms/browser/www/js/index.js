/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


/*





 */
var util = {
    store: function(namespace, data){
        console.log("# arguments: " + arguments);
        if(arguments.length > 1){
            console.log("Storing Data" + JSON.stringify(data));
            return localStorage.setItem(namespace, JSON.stringify(data));
        }
        else{
            var store = localStorage.getItem(namespace);
            if(store){
                console.log("Data Retrieved" + store);
                return JSON.parse(store);
            }
            else{
                console.log("No data to retrieve");
                return [];
            }
        }
    }

};
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
       document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.loadTemplates();
        app.til = util.store('til');
        app.render('container','til',{'til': app.til});
        app.registerCallbacks();

    },
    loadTemplates: function(){
        var templates = ['til', 'addForm', 'til-entry'];
        var templateText = "";
        app.templates = {};

        for(var i =0; i < templates.length; i++){
            templateText = document.getElementById(templates[i]);
            app.templates[templates[i]] = new EJS({text: templateText});
        }
    },
    registerCallbacks: function(){
        $('body').on('click', 'a', function(evt){
            console.log("a tag clicked");
            evt.preventDefault();
            history.pushState({},"",$(this).attr('href'));
            app.route(location.pathname);
        });
        $("#container").on('click', "#submitButton", app.addEntry);
        $("#container").on('click', ".delete", app.deleteEntry);
       
    },
    deleteEntry: function(){
       var entryID = $(this).attr('data-id');
       app.til.splice(entryID,1);
       util.store('til', app.til);
       app.render('container', 'til', {'til': app.til});
    },
    route: function(ref){
        if(ref === '/add'){
            app.render('container', 'addForm');

        }
        if(ref === '/entries'){
            app.render('container', 'til', {'til': app.til});
        }
        if(/\/entries\/(\d*)/.test(ref)){
            var id = parseInt(ref.match(/\/entries\/(\d*)/)[1]);
            app.render('container', 'til-entry', {'til': app.til[id]});
        }
    },
    addEntry: function(evt){
        console.log("add entry called");
        evt.preventDefault();
        var slug = $("#slug").val();

        var body = $("#body").val();

        var entry = {slug: slug, body: body};
        if(slug === "" || body === ""){
            return;
        }
        app.til.push(entry);
        util.store('til', app.til);
        $('#tilForm').hide();
    },

    // Update DOM on a Received Event
   render: function(id, template, data) {
       var containerElement = document.getElementById(id);

       var html = app.templates[template].render(data);
       containerElement.innerHTML = html;
       
    }
};

app.initialize();