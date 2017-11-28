const functions = require('firebase-functions');
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

// https://firebase.google.com/docs/functions/write-firebase-functions
const dictionary=
{0:"Devrim Kay on Earth",
 1:"MIDA Mini-Tool",
 2:"Sloane on Titan",
 3:"Failsafe on Nessus",
 4:"Asher Mir on Io",
 5:"Man 'O War",
 7:"Drang",
 8:"Commander Zavala at the Tower",
 9:"Lord Shaxx at the Tower",
 10:"Banshee-44 at the Tower",
 11:"Ikora Rey at the Tower",
 12:"Benedict 99-40 at the Tower",
 13:"Lakshmi-2 at the Tower",
 14:"Executor Hideo at the Tower",
 15:"Arach Jalaal at the Tower",
 16:"The Emissary at the Inner Circle",
 17:"Lord Saladin at the Tower"};

exports.engram_test = functions.https.onRequest((request,response) =>{

  var current_300 = [];
  var current_296_299 = [];
  var current_295 = [];

	const https = require("https");
	const url =
	  "https://api.vendorengrams.xyz/getVendorDrops?key=63a229c3c4f4efda27df979c3139e48e";
	
	https.get(url, res => {
	  res.setEncoding("utf8");
	  let body = "";
	  res.on("data", data => {
	    body += data;
	  });
	  res.on("end", () => {
         var jsonps = JSON.parse(body);
         let mega_string = "";
         for (var key in jsonps){
            if(jsonps.hasOwnProperty(key)){
               //check if this vendor currently has 300 and is verified
               if( (jsonps[key].type === 3) && (jsonps[key].verified ===1) ){
                  //add this vendor to the 300 array
                  current_300.push(dictionary[jsonps[key].vendor]);

               }
               //check for 296-299
               else if((jsonps[key].type === 1)&&(jsonps[key].verified ===1)){
                  current_296_299.push(dictionary[jsonps[key].vendor]);
               }
               //check for 295
               else if((jsonps[key].type === 0)&&(jsonps[key].verified ===1)){
                  current_295.push(dictionary[jsonps[key].vendor]);
               }
               
            }
         }
         for (var vendor in current_296_299){
            mega_string = mega_string + current_296_299[vendor] + '  ';
         }
         response.send(mega_string);
	  });
	});

});

//'use strict';


process.env.DEBUG = 'actions-on-google:*';

const NO_INPUTS = [
  'I didn\'t hear that.',
  'If you\'re still there, say that again.',
  'We can stop here. See you soon.'
];

exports.maxEngram = functions.https.onRequest((request, response) => {
  const app = new ActionsSdkApp({request, response});
/*
  function mainIntent (app) {
    console.log('mainIntent');
    let inputPrompt = app.buildInputPrompt(true, '<speak>Hi! <break time="1"/> ' +
      'I can read out an ordinal like ' +
      '<say-as interpret-as="ordinal">123</say-as>. Say a number.</speak>', NO_INPUTS);
    app.ask(inputPrompt);
  }
*/
  function mainIntent (app) {
    console.log('mainIntent');
    //let inputPrompt = app.buildInputPrompt(true, '<speak>Hello, I am engram 300 bot! <break time="1"/> ' +
    //  'I will now go pull down current 300 engram data.</speak>', NO_INPUTS);
    //app.tell('<speak>Hello, I am engram 300 bot! <break time="1"/> ' +
    //  'I will now go pull down current 296 to 299 engram data.</speak>');
    const inputPrompt = app.buildInputPrompt(true,'<speak>Hi! <break time="1"/>'+
                      'Please say 300, 296 to 299, 295, or all. </speak>',
                      NO_INPUTS);
    app.ask(inputPrompt);
  }
/*
  function rawInput (app) {
    console.log('rawInput');
    if (app.getRawInput() === 'bye') {
      app.tell('Goodbye!');
    } else {
      let inputPrompt = app.buildInputPrompt(true, '<speak>You said, <say-as interpret-as="ordinal">' +
        app.getRawInput() + '</say-as></speak>', NO_INPUTS);
      app.ask(inputPrompt);
    }
  }
*/
function rawInput (app) {
    console.log('rawInput');
    var selection;
    if (app.getRawInput() === '300') {
      //app.tell('You said 300');
      selection = '300';
    }
    else if(app.getRawInput() === '296 to 299'){
      //app.tell('You said 296 to 299');
      selection = '296 to 299';
    } 
    else if(app.getRawInput() === '295'){
      //app.tell('You said 295');
      selection = '295';
    }
    else {
      let inputPrompt = app.buildInputPrompt(true, '<speak>You said, <say-as interpret-as="ordinal">' +
        app.getRawInput() + '</say-as></speak>', NO_INPUTS);
      app.ask(inputPrompt);
    }
    console.log("Chosen value:"+selection);
    var current_300 = [];
    var current_296_299 = [];
    var current_295 = [];

    const https = require("https");
    const url =
      "https://api.vendorengrams.xyz/getVendorDrops?key=63a229c3c4f4efda27df979c3139e48e";
    
    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
          var jsonps = JSON.parse(body);
          let mega_string = "";
          for (var key in jsonps){
             if(jsonps.hasOwnProperty(key)){
                //check if this vendor currently has 300 and is verified
                if( (jsonps[key].type === 3) && (jsonps[key].verified ===1) ){
                   //add this vendor to the 300 array
                   current_300.push(dictionary[jsonps[key].vendor]);

                }
                //check for 296-299
                else if((jsonps[key].type === 1)&&(jsonps[key].verified ===1)){
                   current_296_299.push(dictionary[jsonps[key].vendor]);
                }
                //check for 295
                else if((jsonps[key].type === 0)&&(jsonps[key].verified ===1)){
                   current_295.push(dictionary[jsonps[key].vendor]);
                }
                
             }
          }
          
          var temp_string = "<speak>The current vendors with power level "+selection+" engrams are ";
          
          if(selection =='300'){
            if(current_300.length == 0){
              temp_string = temp_string + "none";
            }
            else{
              for (var vendor in current_300){
                temp_string = temp_string + current_300[vendor] + '<break time="1"/>   ';
              }
            }  
          }
          else if(selection =='296 to 299'){
            if(current_296_299.length == 0){
              temp_string = temp_string + "none";
            }
            else{
              for (var vendor in current_296_299){
                temp_string = temp_string + current_296_299[vendor] + '<break time="1"/>   ';
              }  
            }
          }
          else if(selection =='295'){
            if(current_295.length == 0){
              temp_string = temp_string + "none";
            }
            else{
              for (var vendor in current_295){
                temp_string = temp_string + current_295[vendor] + '<break time="1"/>   ';
              }  
            }
          }
          
          temp_string+='.</speak>';
          app.tell(temp_string);
      });
    });
  }
  let actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.TEXT, rawInput);

  app.handleRequest(actionMap);
});