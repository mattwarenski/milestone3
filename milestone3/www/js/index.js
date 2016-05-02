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


WATCH MONDAY 18
Then time = 36 Wed 21



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
        app.render('container');
        app.registerCallbacks();

    },
    loadTemplates: function(){
        var templateText =app.templateString();
        app.tilTemplate = new EJS({text: templateText});
        var addFormText = app.getAddFormString();
        app.addFormTemplate = new EJS({text: addFormText});
    },
    registerCallbacks: function(){
        $("#tilForm").hide();
        $("#addEntry").on("click", function(){
           $("#tilForm").show();
        });
        $("#submit").on("click", app.addEntry);
    },
    addEntry: function(evt){
        evt.preventDefault();

        var slug = $("#slug").val();

        var body = $("#body").val();

        var entry = {slug: slug, body: body};
        if(slug === "" || body === ""){
            return;
        }
        app.til.push(entry);
        util.store('til', app.til);
        app.render('container');
        $('#tilForm').hide();
    },
    templateString: function(){
        return "<% for(var i = 0; i < til.length; i++){%> <div> <h1><%=til[i].slug%></h1> <p><%=til[i].body%></p> <button type=\"button\" data-id=\"<%=i%>\" class=\"delete\">Delete</button> </div><%}%>"
    },
    getAddFormString: function(){
        return "<form id=\"tilForm\">Name: <input type=\"text\" id=\"slug\" class=\"entryBox\"></br>Text: <input type=\"text\" id=\"body\" class=\"entryBox\"></br></br><button type=\"submit\" id=\"submit\" class=\"subbutton\">Create</button></form>"
    },
    // Update DOM on a Received Event
   render: function(id) {
       var containerElement = document.getElementById(id);
       var html = app.tilTemplate.render({til: app.til});
       var addForm = app.addFormTemplate.render();
       console.log("Add Form", addForm);
       containerElement.innerHTML = addForm + html;
       //$("#container").append(addForm);

       $(".delete").on("click", function(){
           var entryID = $(this).attr("data-id");
           app.til.splice(entryID,1);
           util.store('til', app.til);

           app.render('container');
           $("#tilForm").hide();
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