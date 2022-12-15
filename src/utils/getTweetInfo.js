import {RETWEET_COLLECTION, USER_COLLECTION} from "../firebase";

export default async (tweet, currentUser) => {
    // Adding user info
    const doc = await USER_COLLECTION.doc(tweet.uid).get();
    tweet.profile_image_url = doc.data().profile_image_url;
    tweet.email = doc.data().email;
    tweet.userName = doc.data().userName;

    // Adding retweet info
    const snapshot = await RETWEET_COLLECTION.where("from_tweet_id", "==", tweet.id).where("user_id", "==", currentUser.uid).get();

    if (snapshot.empty) {
        tweet.isRetweeted = false;
        tweet.isLiked = false;
    } else {
        tweet.isRetweeted = true;
        tweet.isLiked = true;
    }

    return tweet;
};
