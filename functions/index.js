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
 17:"Lord Saladin at the Tower",
 18:"Brother Vance on Mercury"};
//store the possible range of power levels
const power_levels=
{"max":"330",
 "mid":"326-329",
 "low":"325"
};
//delcare arrays to hold response from vendorengrams API

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
        inputString+='<break time=".25"/>Say more for more options or quit at any time to quit.</speak>';
        const inputPrompt = app.buildInputPrompt(true,inputString,NO_INPUTS);
        app.ask(inputPrompt);
      });
    });
  }

  function rawInput (app) {
    console.log('rawInput');
    var inputPrompt;
    var userInput = app.getRawInput().toLowerCase();
    var userInputString = ''
    switch(userInput){
      //entry point to raw Input where user says "more"
      case 'more':      
        userInputString = 'Please say the power range you are interested in. max, mid, or low.';
        inputPrompt = app.buildInputPrompt(true,userInputString,NO_INPUTS);
        app.ask(inputPrompt);
        break;

      case 'no':
        inputPrompt = app.buildInputPrompt(true, '?', NO_INPUTS);
        break;

      //Use case for user saying a valid power level
      case 'max':
      case 'mid':
      case 'low':
        handlePowerResponse(app,userInput);
        break;        

      default:
        InputPrompt = app.buildInputPrompt(true,'Sorry, I didn\'t catch that', NO_INPUTS);
        app.ask(InputPrompt);
        break;
    }
    
  }

  function handlePowerResponse(app,userInput){
    var selection;
    var powerSelection;
    var selected_arr;
    var inputString = '';
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

        switch(userInput){
          case 'max':
            selected_arr = arrMax;
            break;
          case 'mid':
            selected_arr = arrMid;
            break;
          case 'low':
            selected_arr = arrLow;
            break;
          default:
            console.log("Could not identify a power level within handlePowerResponse");
            break;
        }
        console.log("User content was "+userInput);
        console.log("Logging array content");
        console.log(selected_arr);
        console.log(arrLow);
        console.log(arrMid);
        console.log(arrMax);
        if(selected_arr.length === 0){
          inputString+='<speak>There are currently no '+userInput+' power level engrams.';
        }else{
          inputString += '<speak>Here are the '+userInput+' power level engrams.';  
          for (var vendor in selected_arr){
            inputString = inputString + selected_arr[vendor] +'.';
          }      
        }
        //prompt the user with continued dialog
        inputString +='Please say the power range you are interested in. max, mid, or low.';

        var inputPrompt = app.buildInputPrompt(true,inputString,NO_INPUTS);
        app.ask(inputPrompt);
      });
    });
  }

  let actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.TEXT, rawInput);

  app.handleRequest(actionMap);
});