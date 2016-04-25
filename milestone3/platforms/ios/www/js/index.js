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
var til = [];

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
        //app.receivedEvent('deviceready');
        app.render('container');

        $("#submit").on("click", app.addEntry);
    },
    addEntry: function(evt){
        evt.preventDefault();

        var slug = $("#slug").val();

        var body = $("#body").val();

        entry = {slug: slug, body: body};
        til.push(entry);
        app.render('container');
    },
    // Update DOM on a Received Event
   render: function(id) {
       var containerElement = document.getElementById(id);

       var html = "";
       for(var i =0; i < til.length; i++){
           html += "<div></div><h1>" + til[i].slug + "</h1>";
           html += "<p>" + til[i].body + "</p>";
           html += '<button type="button" data-id="'+ i +'" class="delete">Delete</button></div>'
       }
       containerElement.innerHTML = html;

       $(".delete").on("click", function(evt){
           var entryID = $(this).attr("data-id");
           til.splice(entryID,1);
           console.log("Delete"+ entryID);
           app.render('container');
       });
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};

app.initialize();