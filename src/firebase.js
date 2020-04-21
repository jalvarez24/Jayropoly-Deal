import firebase from 'firebase'; 

const  config = {
    apiKey: "AIzaSyCN0gsk1xOlGOqM3diSFMvFFsVWlrTXzp4",
    authDomain: "jayropoly-deal.firebaseapp.com",
    databaseURL: "https://jayropoly-deal.firebaseio.com",
    projectId: "jayropoly-deal",
    storageBucket: "jayropoly-deal.appspot.com",
    messagingSenderId: "829715769084",
    appId: "1:829715769084:web:1a726b23ce6a04950d1979",
    measurementId: "G-0CZN4FDRPM"
  };

// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

export default firebase;