import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDqBydwuhcp37SsXCiVal_aI4x_a26-5Yk",
    authDomain: "twitter-clone-8163a.firebaseapp.com",
    projectId: "twitter-clone-8163a",
    storageBucket: "twitter-clone-8163a.appspot.com",
    messagingSenderId: "1001015080240",
    appId: "1:1001015080240:web:96517cf0efb50518d684f5",
    measurementId: "G-TYFV5W2S9R",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const USER_COLLECTION = db.collection("users");
export const TWEET_COLLECTION = db.collection("tweets");
export const COMMENT_COLLECTION = db.collection("comments");
export const RETWEET_COLLECTION = db.collection("retweets");
export const LIKES_COLLECTION = db.collection("likes");
