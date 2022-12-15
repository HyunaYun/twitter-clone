<template>
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" ></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex justify-center text-center" @click="$emit('close-modal')">

            <!-- contents -->
            <div @click.stop class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-10 w-full sm:max-w-lg">
                <div class="bg-white sm:p-2 sm:pb-2 sm:w-full">
                    <div class="border-b border-gray-100 p-2">
                        <button class="fas fa-times text-primary text-lg w-10 h-10 hover:bg-blue-50 rounded-full" @click="$emit('close-modal')"></button>
                    </div>
                </div>
                <div>
                    <!-- original tweet -->
                    <div class="flex px-4 pt-4 pb-3">
                        <div class="flex flex-col">
                            <img :src="tweet.profile_image_url" class="w-10 h-10 rounded-full hover:opacity-80 cursor-pointer"/>
                            <div class="ml-5 w-0.5 h-full bg-gray-300 mt-2 -mb-2"></div>
                        </div>
                        <div class="flex-1 ml-2">
                            <div class="flex space-x-2">
                                <span class="font-bold text-sm">{{tweet.email}}</span>
                                <span class="text-gray text-sm">@{{tweet.userName}}</span>
                                <span class="text-gray text-sm">{{moment(tweet.created_at).fromNow()}}</span>
                            </div>
                            <div class="text-sm">{{tweet.tweet_body}}</div>
                            <div>
                                <span class="text-primary text-sm">@{{tweet.userName}}</span>
                                <span class="text-gray text-sm"> 님에게 보내는 댓글</span>
                            </div>
                        </div>
                    </div>

                    <!-- tweeting section -->
                    <div class="flex px-4 pt-4 pb-4">
                        <img :src="currentUser.profile_image_url" class="w-10 h-10 rounded-full hover:opacity-80 cursor-pointer"/>
                        <div class="flex-1 flex flex-col ml-2">
                            <textarea v-model="tweetBody" rows="4" placeholder="내 답글을 트윗 합니다." class="w-full text-lg font-bold focus:outline-none mb-5 resize-none"></textarea>
                            <div class="text-right">
                                <button v-if="!tweetBody.length" class="bg-light text-white px-4 py-1 rounded-full text-sm font-bold">답글</button>
                                <button v-else @click="onCommentTweet" class="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-dark">답글</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import {computed, ref} from 'vue'
import store from '../store'
import moment from 'moment'
import {COMMENT_COLLECTION, TWEET_COLLECTION} from '../firebase'
import firebase from 'firebase'

export default {
    name: 'TwitterCloneCommentModal',

    props: [
        'tweet',
    ],

    setup(props, {emit}) {
        const tweetBody = ref("")
        const currentUser = computed(() => store.state.user)

        const onCommentTweet = async () => {
        try {
          const doc = COMMENT_COLLECTION.doc()

          await doc.set({
            id: doc.id,
            from_tweet_id: props.tweet.id,
            comment_tweet_body: tweetBody.value,
            uid: currentUser.value.uid,
            created_at: Date.now(),
          })

          await TWEET_COLLECTION.doc(props.tweet.id).update({
            "num_comments": firebase.firestore.FieldValue.increment(1),
          })

          emit('close-modal')
        } catch (e) {
          console.log("on comment tweet error : ", e);
        }
      }

        return {
            tweetBody, currentUser, moment, onCommentTweet
        }
    }
};
</script>