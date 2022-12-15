<template>
    <div class="flex-1 flex">
        <div class="flex-1 border-r border-gray-100">
            <div class="flex flex-col">
                
            </div>
        </div>
    </div>
</template>

<script>
import Tweet from '../components/Tweet.vue'
import Trends from '../components/Trends.vue'
import { ref, computed, onBeforeMount } from 'vue'
import store from '../store'
import { TWEET_COLLECTION, USER_COLLECTION } from '../firebase'
import addTweet from '../utils/addTweet'
import getTweetInfo from '../utils/getTweetInfo'

export default {
    name: 'TwitterCloneHome',

    components: {
      Tweet,
      Trends
    },

    setup() {
      const tweetBody = ref("")
      const currentUser = computed(() => store.state.user);
      const tweets = ref([])

      onBeforeMount(() => {
        TWEET_COLLECTION.orderBy('created_at', 'desc').onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            let tweet = await getTweetInfo(change.doc.data(), currentUser.value)

            if (change.type === 'added') {
              tweets.value.splice(change.newIndex, 0, tweet)
            } else if (change.type === 'modified') {
              tweets.value.splice(change.oldIndex, 1, tweet)
            } else if (change.type === 'removed') {
              tweets.value.splice(change.oldIndex, 1)
            }
          })
        })
      })

      const onAddTweet = async () => {
        try {
          await addTweet(tweetBody.value, currentUser.value)
          tweetBody.value = ''
        } catch (e) {
          console.log(e);
        }
      }

      return {
        currentUser, tweetBody, onAddTweet, tweets, onBeforeMount
      }
    }
};
</script>

<style lang="scss" scoped>

</style>