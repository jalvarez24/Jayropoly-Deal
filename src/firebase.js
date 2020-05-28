import firebase from 'firebase'; 

const  config = 
// window.location.hostname === "localhost" ? 
  // {
  //   apiKey: "AIzaSyDUenc-VRfUD7mQJH6NIPaDW9SJkiqc8iM",
  //   authDomain: "i-got-it-fam.firebaseapp.com",
  //   databaseURL: "http://localhost:9000/?ns=i-got-it-fam",
  //   projectId: "i-got-it-fam",
  //   storageBucket: "i-got-it-fam.appspot.com",
  //   messagingSenderId: "771947671155",
  //   appId: "1:771947671155:web:e6fd9a8177b6419c44c406",
  //   measurementId: "G-PGV3P81H6H"
  // }
  // :
  {
    apiKey: "AIzaSyDUenc-VRfUD7mQJH6NIPaDW9SJkiqc8iM",
    authDomain: "i-got-it-fam.firebaseapp.com",
    databaseURL: "https://i-got-it-fam.firebaseio.com",
    projectId: "i-got-it-fam",
    storageBucket: "i-got-it-fam.appspot.com",
    messagingSenderId: "771947671155",
    appId: "1:771947671155:web:e6fd9a8177b6419c44c406",
    measurementId: "G-PGV3P81H6H"
  };

// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

export default firebase;