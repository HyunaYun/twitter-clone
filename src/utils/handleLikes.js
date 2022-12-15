import { LIKES_COLLECTION, TWEET_COLLECTION } from "../firebase";
import store from "../store";
import firebase from "firebase";

export default async(tweet) => {
    try {
        // already liked
        if (tweet.isLiked) {
            // delete retweet doc
            const snapshot = await LIKES_COLLECTION.where("from_tweet_id", "==", tweet.id).where("user_id", "==", store.state.user.uid).get();
            snapshot.docs[0].ref.delete();

            // decrease liked number
            await TWEET_COLLECTION.doc(tweet.id).update({
                num_likes: firebase.firestore.FieldValue.increment(-1),
            });
        } else {
            // no liked
            const doc = LIKES_COLLECTION.doc();

            await doc.set({
                id: doc.id,
                from_tweet_id: tweet.id,
                user_id: store.state.user.uid,
                created_at: Date.now(),
            });

            await TWEET_COLLECTION.doc(tweet.id).update({
                num_likes: firebase.firestore.FieldValue.increment(1),
            });
        }
    } catch (e) {
        console.log("handle liked error : ", e);
    }
};