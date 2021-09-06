// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
import socket from "./socket"
//
import "phoenix_html"


let channel = socket.channel("chat_room:lobby", {});

//Get elements
let list = $("#message-list");
let message = $("#msg");
let name = $("#name");

message.on("keypress", event => {

    //If enter is pressed
    if (event.keyCode == 13) {
        //Broadcast to channel
        channel.push("shout", {
            name: name.val(),
            message: message.val()
        });
        message.val("");
    }
});

//Listen for broadcast events(shout)
channel.on("shout", payload =>{ 

    list.append(`<b>${payload.name} || 'new_user':</b> ${payload.message}<br>`);
    list.prop({
        scrollTop: list.prop("scrollHeight")

    });
});

channel.join().receive("ok", resp =>{

    console.log("Joined successfully", resp);
    
}).receive("error", resp => {

    console.log("Unable to join", resp);
})