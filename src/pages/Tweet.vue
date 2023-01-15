<template>
    <div class="flex-1 flex">
        <div class="flex-1 border-r border-gray-100">
            <div class="flex flex-col" v-if="tweet">
              <!-- title -->
              <div class="flex px-3 py-2 border-b border-gray-100 items-center">
                <button @click="router.go(-1)">
                  <i class="fas fa-arrow-left text-primary text-lg ml-3 hover:bg-blue-50 p-2 rounded-full h-10 w-10"></i>
                </button>
                <span class="font-bold text-lg ml-6">트윗</span>
              </div>

            <!-- tweet -->
            <div class="px-3 py-2 flex">
              <img :src="tweet.profile_image_url" class="w-10 h-10 rounded-full cursor-pointer hover:opacity-90" />
              <div class="ml-2">
                <div class="font-bold">{{tweet.email}}</div>
                <div class="text-gray text-sm">@{{tweet.userName}}</div>
              </div>
            </div>

            <!-- contents -->
            <div class="px-3 py-2">{{tweet.tweet_body}}</div>
            <div class="px-3 py-2 text-gray text-xs">{{moment(tweet.created_at).fromNow()}}</div>
            <div class="h-px w-full bg-gray-100"></div>
            <div class="flex space-x-2 px-3 py-2 items-center">
              <span class="">{{tweet.num_retweets}}</span>
              <span class="text-sm text-gray">리트윗</span>
              <span class="ml-5">{{tweet.num_likes}}</span>
              <span class="text-sm text-gray">마음에 들어요</span>
            </div>
            <div class="h-px w-full bg-gray-100"></div>

            <!-- button -->
            <div class="flex justify-around py-2">
              <!-- comment btn -->
                <button @click="showCommentModal = true" class="text-gray-400 hover:text-primary" >
                    <i class="far fa-comment text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full p-2"></i>
                </button>
                <!-- retweet btn -->
                <button @click="handleRetweet(tweet)">
                    <i v-if="tweet.isRetweeted" class="fas fa-retweet text-green-400 hover:bg-green-50 rounded-full p-2"></i>
                    <i v-else class="fas fa-retweet text-gray-400 hover:text-green-400 hover:bg-green-50 rounded-full p-2"></i>
                </button>
                <!-- like btn -->
                <button @click="handleLikes(tweet)">
                    <i v-if="tweet.isLiked" class="far fa-heart text-red-400 hover:bg-red-50 rounded-full p-2"></i>
                    <i v-else class="far fa-heart text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full p-2"></i>
                </button>
            </div>
            <div class="h-px w-full bg-gray-100"></div>

            <!-- comments -->
            <div v-for="comment in comments" :key="comment" class="flex hover:bg-gray-50 cursor-pointer px-3 py-3 border-b border-gray-100">
              <img :src="comment.profile_image_url" class="w-10 h-10 rounded-full cursor-pointer hover:opacity-90" />
              <div class="ml-2 flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-bold">{{comment.email}}</span>
                  <span class="text-gray text-sm">@{{comment.userName}}</span>
                  <span>{{moment(comment.created_at).fromNow()}}</span>
                </div>
                <div>{{comment.comment_tweet_body}}</div>
              </div>
              <button @click="handleDeleteComment(comment)" v-if="comment.uid === currentUser.uid">
                <i class="fas fa-trash text-red-400 hover:bg-red-50 h-10 w-10 rounded-full p-2"></i>
              </button>
            </div>
          </div>
        </div>

        <Trends />
        <comment-modal :tweet="tweet" v-if="showCommentModal" @close-modal="showCommentModal = false" />
    </div>
</template>

<script>
import Trends from '../components/Trends.vue'
import CommentModal from '../components/CommentModal.vue'
import getTweetInfo from '../utils/getTweetInfo'
import handleRetweet from '../utils/handleRetweet'
import handleLikes from '../utils/handleLikes'

import { ref, computed, onBeforeMount } from 'vue'
import {useRoute} from 'vue-router'
import { TWEET_COLLECTION, COMMENT_COLLECTION } from '../firebase'

import store from '../store'
import router from '../router'
import moment from 'moment'
import firebase from 'firebase'


export default {
    name: 'TwitterCloneHome',

    components: {
      Trends,
      CommentModal
    },

    setup() {
      const tweet = ref(null);
      const comments = ref([])
      const currentUser = computed(() => store.state.user)

      const showCommentModal = ref(false);

      const route = useRoute()

      const handleDeleteComment = async (comment) => {
        if (confirm("댓글을 삭제하시겠습니까?")) {
          // delete comment
          await COMMENT_COLLECTION.doc(comment.id).delete()
  
          // decrease tweet num comments
          await TWEET_COLLECTION.doc(comment.from_tweet_id).update({
            "num_comments" : firebase.firestore.FieldValue.increment(-1)
          })
        }
      }

      onBeforeMount(async ()=> {
        await TWEET_COLLECTION.doc(route.params.id).onSnapshot(async doc => {
          const t = await getTweetInfo(doc.data(), currentUser.value)
          tweet.value = t
        })

        COMMENT_COLLECTION.orderBy('created_at', 'desc').onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            let comment = await getTweetInfo(change.doc.data(), currentUser.value)

            if (change.type === 'added') {
              comments.value.splice(change.newIndex, 0, comment)
            } else if (change.type === 'modified') {
              comments.value.splice(change.oldIndex, 1, comment)
            } else if (change.type === 'removed') {
              comments.value.splice(change.oldIndex, 1)
            }
          })
        })
      })

      return {
        onBeforeMount, router, tweet, comments, currentUser, moment, showCommentModal, handleRetweet, handleLikes, comments, handleDeleteComment
      }
    }
};
</script>

<style lang="scss" scoped>

</style>