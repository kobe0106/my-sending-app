import * as firebase from "firebase";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkk_6LKpG1IMC8JANbaTeizMkcLdAc1qU",
    authDomain: "my-sending-app.firebaseapp.com",
    databaseURL: "https://my-sending-app.firebaseio.com",
    projectId: "my-sending-app",
    storageBucket: "my-sending-app.appspot.com",
    messagingSenderId: "485089394402",
    appId: "1:485089394402:web:3236e0a792398f76"
  };

  export const Firebase = firebase.initializeApp(config);