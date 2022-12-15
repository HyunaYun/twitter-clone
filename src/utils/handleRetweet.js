import {RETWEET_COLLECTION, TWEET_COLLECTION} from "../firebase";
import store from "../store";
import firebase from "firebase";

export default async (tweet) => {
    try {
        // already retweeted
        if (tweet.isRetweeted) {
            // delete retweet doc
            const snapshot = await RETWEET_COLLECTION.where("from_tweet_id", "==", tweet.id).where("user_id", "==", store.state.user.uid).get();
            snapshot.docs[0].ref.delete();

            // decrease retweet number
            await TWEET_COLLECTION.doc(tweet.id).update({
                num_retweets: firebase.firestore.FieldValue.increment(-1),
            });
        } else {
            // no retweeted
            const doc = RETWEET_COLLECTION.doc();

            await doc.set({
                id: doc.id,
                from_tweet_id: tweet.id,
                user_id: store.state.user.uid,
                created_at: Date.now(),
            });

            await TWEET_COLLECTION.doc(tweet.id).update({
                num_retweets: firebase.firestore.FieldValue.increment(1),
            });
        }
    } catch (e) {
        console.log("handle retweet error : ", e);
    }
};
