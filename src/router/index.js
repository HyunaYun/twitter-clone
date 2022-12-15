import {createWebHistory, createRouter} from "vue-router";
import Home from "../pages/Home.vue";
import Notifications from "../pages/Notifications.vue";
import Messages from "../pages/Messages.vue";
import Profile from "../pages/Profile.vue";
import Register from "../pages/Register.vue";
import Login from "../pages/Login.vue";
import store from "../store";

const routes = [
    {
        path: "/",
        component: Home,
        title: "홈",
        name: "home",
        icon: "fas fa-house fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/",
        component: Home,
        title: "탐색하기",
        name: "explore",
        icon: "fas fa-hashtag fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/notifications",
        component: Notifications,
        title: "알림",
        name: "notifications",
        icon: "far fa-bell fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/messages",
        component: Messages,
        title: "쪽지",
        name: "messages",
        icon: "far fa-envelope fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/",
        component: Home,
        title: "북마크",
        name: "bookmarks",
        icon: "far fa-bookmark fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/",
        component: Home,
        title: "리스트",
        name: "list",
        icon: "far fa-list-alt fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/profile",
        component: Profile,
        title: "프로필",
        name: "profile",
        icon: "far fa-user fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/",
        component: Home,
        title: "더보기",
        name: "more",
        icon: "fas fa-ellipsis-h fa-fw text-2xl",
        meta: {isMenu: true, layout: "DefaultLayout", requireAuth: true},
    },
    {
        path: "/login",
        component: Login,
        name: "login",
        meta: {isMenu: false, layout: "EmptyLayout"},
    },
    {
        path: "/register",
        component: Register,
        name: "register",
        meta: {isMenu: false, layout: "EmptyLayout"},
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// navigation guard
router.beforeEach((to, from, next) => {
    const currentUser = store.state.user;
    const requireAuth = to.matched.some((record) => record.meta.requireAuth);

    // not authenticated
    if (requireAuth && !currentUser) {
        next("/login");
    }
    // authenticated
    else {
        next();
    }
});

export default router;
