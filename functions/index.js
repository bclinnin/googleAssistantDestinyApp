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

//store the possible range of power levels
const power_levels=
{"max":"300",
 "mid":"296-299",
 "low":"295"
}

exports.engram_test = functions.https.onRequest((request,response) =>{


  var arrMax = [];
  var arrMid = [];
  var arrLow = [];

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

          //record data if vendor is verified
          if(jsonps[key].verified===1){
            switch(jsonps[key].type){
              case 3:
                arrMax.push(dictionary[jsonps[key].vendor]);
                break;

              case 1:
                arrMid.push(dictionary[jsonps[key].vendor]);
                break;

              case 0:
                arrLow.push(dictionary[jsonps[key].vendor]);
                break;

              default:
                break;
            }
          }               
        }
      }
      mega_string+="~~~~MAX~~~~";
      for (var vendor in arrMax){
        mega_string = mega_string + arrMax[vendor] + '  ';
      }
      mega_string+="~~~~MID~~~~";
      for (var vendor in arrMid){
        mega_string = mega_string + arrMid[vendor] + '  ';
      }
      mega_string+="~~~~LOW~~~~";
      for (var vendor in arrLow){
        mega_string = mega_string + arrLow[vendor] + '  ';
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
  var arrMax = [];
  var arrMid = [];
  var arrLow = [];
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

    var inputString = "";
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

            //record data if vendor is verified
            if(jsonps[key].verified===1){
              switch(jsonps[key].type){
                case 3:
                  arrMax.push(dictionary[jsonps[key].vendor]);
                  break;

                case 1:
                  arrMid.push(dictionary[jsonps[key].vendor]);
                  break;

                case 0:
                  arrLow.push(dictionary[jsonps[key].vendor]);
                  break;

                default:
                  break;
              }
            }               
          }
        }
        if(arrMax.length == 0){
          inputString+='<speak>There are currently no max power level engrams.';
        }
        else{
          inputString += '<speak>Here are the max power level engrams.';  
          for (var vendor in arrMax){
            inputString = inputString + arrMax[vendor] +'.';
          }
        }
        inputString+='<break time="1"/>Say more for more options or quit to quit.</speak>';
        const inputPrompt = app.buildInputPrompt(true,inputString,NO_INPUTS);
        app.ask(inputPrompt);
      });
    });
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
    if(app.getRawInput() === 'more'){
      app.tell('path not yet implemented');
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