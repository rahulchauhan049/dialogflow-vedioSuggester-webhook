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
var categoryList = [`movies`, `serials`];
var genreList = [`action`, `adventure`, `animation`, `children`, `comedy`, `crime`, `drama`, `fantasy`, `fiction`, `historical`, `horror`, `mystery`, `romance`, `spy`, `thriller`];
var randomCategory = categoryList[randomNumber(categoryList)];
var randomGenre = genreList[randomNumber(genreList)];
//handle all vedio selection part....
app.intent("suggest-vedio", conv => {
    const lang = conv.body.queryResult.languageCode;

    const category = (conv.parameters['vedioType']);
    const genre = (conv.parameters['genre']);
    return db.ref("vedios/").once("value", snapshot => {
        const data = snapshot.val();
        if (category.length==1 && genre.length==1){
        	const num = data[String(category)][String(genre)].length;
        	const random = Math.floor((Math.random() * num));
        	const toPrint = data[String(category)][String(genre)][random];
            if(lang === 'hi'){
                conv.close(`आज मैं आपको" ${toPrint} "देखने का सुझाव देता हूं`);
            }
            else{
        	    conv.close(`Today i suggest you to watch "${toPrint}".`);
            }
   		} else if (category.length==1 && genre.length==0){
   			const randomDataLength = Math.floor((Math.random() * data[String(category)][randomGenre].length));
    		const randomMovieWG = data[String(category)][randomGenre][randomDataLength];
            if(lang === 'hi'){
                conv.close(`मुझे लगता है कि आपको आज "${randomMovieWG}" देखना चाहिए।`);
            }else{
                conv.close(`I think you should watch "${randomMovieWG}" today.`);
            }
   		} else if (category.length==0 && genre.length==1){
   			const randomDataLength = Math.floor((Math.random() * data[randomCategory][String(genre)].length));
    		const randomMovieWC = data[randomCategory][String(genre)][randomDataLength];
            if(lang === 'hi'){
                conv.close(`मुझे लगता है कि आपको आज "${randomMovieWC}" देखना चाहिए।`);
            }else{
            conv.close(`I think you should watch "${randomMovieWC}" today.`);
            }
   		}
   		else {
    		const randomDataLength = Math.floor((Math.random() * data[randomCategory][randomGenre].length));
            const randomMovieWA = data[randomCategory][randomGenre][randomDataLength];
            if(lang === 'hi'){
                conv.close(`मुझे लगता है कि आपको आज "${randomMovieWA}" देखना चाहिए।`);
            }else{
            conv.close(`Ummm! I think you can watch "${randomMovieWA}".`);
            }
    	} 
        
    });
});
function randomNumber(list){
	const length = list.length;
    const random = Math.floor((Math.random() * length));
    return random;
}

exports.googleAction = functions.https.onRequest(app);
