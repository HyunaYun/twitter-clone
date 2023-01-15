<template>
    <div class="flex-1 flex">
        <!-- profile section -->
        <div class="flex-1 flex flex-col border-r border-color">
            <!-- title -->
            <div class="px-3 py-1 flex border-b border-color">
                <button class="mr-4">
                    <i class="fas fa-arrow-left text-primary p-3 rounded-full hover:bg-blue-50"></i>
                </button>
                <div>
                    <div class="font-extrabold text-lg">{{currentUser.userName}}</div>
                    <div class="text-xs text-gray">{{currentUser.num_tweets}} 트윗</div>
                </div>
            </div>

            <!-- background image -->
            <div class="bg-gray-300 h-40 relative flex-none">
                <!-- profile image -->
                <div class="w-28 h-28 border-2 border-white bg-gray-100 rounded-full absolute -bottom-14 left-2">
                    <img :src="currentUser.profile_image_url" class="rounded-full opacity-90 hover:opacity-100 cursor-pointer" />
                </div>
            </div>

            <!-- profile edit -->
            <div class="text-right mr-2 mt-2">
                <button class="border text-sm border-primary text-primary px-3 py-2 hover:bg-blue-50 font-bold rounded-full">
                    프로필 수정
                </button>
            </div>

            <!-- user info -->
            <div class="mx-3 mt-2">
                <div class="font-extrabold text-lg">{{currentUser.email}}</div>
                <div class="text-gray">@{{currentUser.userName}}</div>
                <div>
                    <span class="text-gray">가입일:</span>
                    <span class="text-gray">{{moment(currentUser.created_at).format('YYYY월 MM일')}}</span>
                </div>
                <div>
                    <span class="font-bold mr-1">{{currentUser.followings.length}}</span>
                    <span class="text-gray mr-3">팔로우 중</span>
                    <span class="font-bold mr-1">{{currentUser.followers.length}}</span>
                    <span class="text-gray">팔로워</span>
                </div>
            </div>

            <!-- tabs -->
            <div class="flex border-b border-color mt-3">
                <div @click="currentTab = 'tweet'" :class="`${currentTab == 'tweet' ? 'text-primary border-b border-primary' : 'text-gray'} w-1/3 py-3 font-bold  text-center hover:bg-blue-50 cursor-pointer hover:text-primary`">
                    트윗
                </div>
                <div @click="currentTab = 'retweet'" :class="`${currentTab == 'retweet' ? 'text-primary border-b border-primary' : 'text-gray'} w-1/3 py-3 font-bold  text-center hover:bg-blue-50 cursor-pointer hover:text-primary`">
                    리트윗
                </div>
                <div @click="currentTab = 'like'" :class="`${currentTab == 'like' ? 'text-primary border-b border-primary' : 'text-gray'} w-1/3 py-3 font-bold  text-center hover:bg-blue-50 cursor-pointer hover:text-primary`">
                    좋아요
                </div>
            </div>

            <!-- Tweet -->
            <div class="overflow-y-scroll">
                <Tweet v-for="tweet in currentTab == 'tweet' ? tweets : currentTab == 'retweet' ? retweets : likeTweets" :key="tweet" :currentUser="currentUser" :tweet="tweet"/>
            </div>
        </div>

        <!-- trends section -->
        <Trends />
    </div>
</template>

<script>
import Tweet from '../components/Tweet.vue'
import Trends from '../components/Trends.vue'
import getTweetInfo from '../utils/getTweetInfo'

import store from '../store'
import moment from 'moment'

import { ref, computed, onBeforeMount } from 'vue'
import { TWEET_COLLECTION, USER_COLLECTION, RETWEET_COLLECTION, LIKES_COLLECTION } from '../firebase'

export default {
    name: 'TwitterCloneProfile',

    components: {
        Tweet,
        Trends
    },

    setup() {
        const currentUser = computed (() => store.state.user);
        const tweets = ref([]);
        const retweets = ref([]);
        const likeTweets = ref([]);
        const currentTab = ref('tweet')

        onBeforeMount(() => {
            USER_COLLECTION.doc(currentUser.value.uid).onSnapshot(doc => {
                store.commit("SET_USER", doc.data())
            })

            TWEET_COLLECTION.where('uid', '==', currentUser.value.uid).orderBy('created_at', 'desc').onSnapshot((snapshot) => {
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

            RETWEET_COLLECTION.where('user_id', '==', currentUser.value.uid).orderBy('created_at', 'desc').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    const doc = await TWEET_COLLECTION.doc(change.doc.data().from_tweet_id).get();
                    let tweet = await getTweetInfo(doc.data(), currentUser.value)
                    
                    if (change.type === 'added') {
                        retweets.value.splice(change.newIndex, 0, tweet)
                    } else if (change.type === 'modified') {
                        retweets.value.splice(change.oldIndex, 1, tweet)
                    } else if (change.type === 'removed') {
                        retweets.value.splice(change.oldIndex, 1)
                    }
                })
            })

            LIKES_COLLECTION.where('user_id', '==', currentUser.value.uid).orderBy('created_at', 'desc').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    const doc = await TWEET_COLLECTION.doc(change.doc.data().from_tweet_id).get();
                    let tweet = await getTweetInfo(doc.data(), currentUser.value)

                    if (change.type === 'added') {
                        likeTweets.value.splice(change.newIndex, 0, tweet)
                    } else if (change.type === 'modified') {
                        likeTweets.value.splice(change.oldIndex, 1, tweet)
                    } else if (change.type === 'removed') {
                        likeTweets.value.splice(change.oldIndex, 1)
                    }
                })
            })
        })

        return {
            currentUser, tweets, retweets, likeTweets, moment, currentTab
        }
    }
};
</script>

<style lang="scss" scoped>

</style>