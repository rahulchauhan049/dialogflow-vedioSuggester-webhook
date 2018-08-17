"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();
const { dialogflow, Image, SimpleResponse } = require('actions-on-google');
const app = dialogflow({
    debug: true
});
//Handles All Meme Part
app.intent("suggest-vedio", conv => {
    const category = String(conv.parameters['vedioType']);
    const genre = String(conv.parameters['genre']);

    //Takes Images URL from Database
    return db.ref("vedios/").once("value", snapshot => {
        const data = snapshot.val();
        const num = data[category][genre].length;
        const random = Math.floor((Math.random() * num));
        const toPrint = data[category][genre][random];
        conv.add(`I think you should watch ${toPrint} today.`);
        
    });
});
exports.googleAction = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map