<template>
  <div class="flex h-screen container mx-auto">
    <!-- side section -->
    <div class="w-20 xl:w-1/4 pt-5 xl:ml-10 flex flex-col justify-between border-r border-gray-100">
      <div class="flex flex-col items-center xl:items-start">
        <!-- twitter logo -->
        <i class="fa-brands fa-twitter text-3xl text-primary xl:ml-4 mb-3"></i>

        <!-- sidemenu icons -->
        <div class="flex flex-col items-start space-y-1">
          <router-link :to="route.path" :class="`hover:text-primary hover:bg-blue-50 xl:px-4 xl:py-2 p-2 rounded-full cursor-pointer ${router.currentRoute.value.name == route.name ? 'text-primary' : ''}`" v-for="route in routes" :key="route">
            <div v-if="route.meta.isMenu">
                <i :class="route.icon"></i>
                <span class="text-xl ml-5 hidden xl:inline-block">{{route.title}}</span>
            </div>
          </router-link>
        </div>

        <!-- tweet button -->
        <div class="w-full xl:pr-3 flex justify-center">
          <button @click="showTweetModal = true" class="bg-primary text-white w-12 xl:w-full h-12 rounded-full hover:bg-dark mt-3">
            <span class="hidden xl:inline-block">Tweet</span>
            <i class="fas fa-plus xl:hidden"></i>
          </button>
        </div>
      </div>

      <!-- profile button -->
      <div class="xl:pr-3 mb-3" @click="showProfileDropdown = true">
        <button class="hidden xl:flex px-2 py-1 w-full h-12 rounded-full hover:bg-blue-50 mt-3 items-center">
          <img :src="currentUser.profile_image_url" class="w-10 h-10 rounded-full" />
          <div class="xl:ml-2 hidden xl:block">
            <div class="text-sm font-bold">{{currentUser.email}}</div>
            <div class="text-xs text-gray-500 text-left">@{{currentUser.userName}}</div>
          </div>
          <i class="ml-auto fas fa-ellipsis-h fa-fw text-xs hidden xl:block"></i>
        </button>

        <div class="xl:hidden flex justify-center">
          <img :src="currentUser.profile_image_url" class="w-10 h-10 rounded-full cursor-pointer hover:opacity-80" />
        </div>
      </div>
    </div>

    <!-- main section -->
    <div class="flex-1 flex h-screen">
      <router-view />
    </div>

    <!-- profile dropdown menu -->
    <div v-if="showProfileDropdown" @click="showProfileDropdown = false" class="absolute bottom-20 left-10 shadow rounded-lg w-60 bg-white">
      <button class="hover:bg-gray-50 border-b border-gray-100 flex p-3 w-full items-center">
        <img :src="currentUser.profile_image_url" class="w-10 h-10 rounded-full" />
        <div class="ml-2">
          <div class="font-bold text-sm">{{currentUser.email}}</div>
          <div class="text-left text-gray-500 text-sm">@{{currentUser.userName}}</div>
        </div>
        <i class="fas fa-check text-primary ml-auto"></i>
      </button>
      <button class="hover:bg-gray-50 p-3 w-full text-left text-sm" @click="onLogout">
        @hyuna 계정에서 로그아웃
      </button>
    </div>
  </div>

  <!-- tweet modal -->
  <TweetModal v-if="showTweetModal" @close-modal="showTweetModal = false"/>
</template>

<script>
import { ref, onBeforeMount, computed } from 'vue'
import router from '../router'
import store from '../store'
import { auth } from '../firebase'
import TweetModal from '../components/TweetModal.vue'

export default {
  components: {TweetModal},

  setup() {
    const routes = ref([]);
    const showProfileDropdown = ref(false);
    const showTweetModal = ref(false);

    const currentUser = computed(() => store.state.user)

    const onLogout = async () => {
      await auth.signOut();
      store.commit("SET_USER", null);
      await router.replace("/login")
    }

    onBeforeMount(() => {
      routes.value = router.options.routes.filter(route => route.meta.isMenu === true)
    })

    return { routes, showProfileDropdown, currentUser, router, showTweetModal, onLogout }
  },
}
</script>

<style scoped>
</style>
