<template>
    <!-- main part -->
    <div class="flex-1 border-r border-gray-100 overflow-y-auto">
      <div class="flex flex-col">
        <!-- page title -->
        <div class="border-b border-gray-100 px-3 py-2 text-lg font-bold">홈</div>

        <!-- tweeting section -->
        <div class="flex px-3 py-3 border-b-8 border-gray-100">
          <img src="http://picsum.photos/200" class="w-10 h-10 rounded-full hover:opacity-80 cursor-pointer"/>
          <div class="flex-1 flex flex-col ml-2">
            <textarea placeholder="무슨 일이 일어나고 있나요?" class="w-full text-lg font-bold focus:outline-none mb-3 resize-none"></textarea>
            <div class="text-right">
              <button class="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-dark">트윗</button>
            </div>
          </div>
        </div>
      </div>

      <!-- tweet -->
      <Tweet/>
    </div>

    <!-- trend part -->
    <Trends />
</template>

<script>
import Tweet from '../components/Tweet.vue'
import Trends from '../components/Trends.vue'

export default {
    name: 'TwitterCloneHome',

    components: {
      Tweet,
      Trends
    },

    data() {
        return {

        };
    },

    mounted() {

    },

    methods: {

    },
};
</script>

<style lang="scss" scoped>

</style>