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

                <!-- tweeting section -->
                <div class="flex p-4">
                    <img :src="currentUser.profile_image_url" class="w-10 h-10 rounded-full hover:opacity-80 cursor-pointer"/>
                    <div class="flex-1 flex flex-col ml-2">
                        <textarea v-model="tweetBody" rows="5" placeholder="무슨 일이 일어나고 있나요?" class="w-full text-lg font-bold focus:outline-none mb-5 resize-none"></textarea>
                        <div class="text-right">
                            <button v-if="!tweetBody.length" class="bg-light text-white px-4 py-1 rounded-full text-sm font-bold">트윗</button>
                            <button v-else @click="onAddTweet" class="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-dark">트윗</button>
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
import addTweet from '../utils/addTweet'
import store from '../store'

export default {
    name: 'TwitterCloneTweetModal',

    setup(props, {emit}) {
        const tweetBody = ref("")
        const currentUser = computed(() => store.state.user)

        const onAddTweet = async () => {
        try {
          await addTweet(tweetBody.value, currentUser.value)
          tweetBody.value = ''
          emit('close-modal')
        } catch (e) {
          console.log(e);
        }
      }

        return {
            tweetBody, currentUser, onAddTweet
        }
    }
};
</script>