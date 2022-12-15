<template>
    <div class="flex flex-col items-center space-y-4 mt-10">
        <i :class="`fab fa-twitter text-4xl text-primary ${loading ? 'animate-bounce' : ''}`"></i>
        <span class="text-2xl font-bold">뜨위떠 로그인</span>
        <input v-model="email" type="text" class="w-96 px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:border-primary focus:outline-none" placeholder="이메일" />
        <input v-model="password"  @keyup.enter="onLogin" type="password" class="w-96 px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:border-primary focus:outline-none" placeholder="비밀번호" />
        <button v-if="loading" class="w-96 rounded-full bg-light text-white py-3">로그인 중입니다.</button>
        <button v-else class="w-96 rounded-full bg-primary text-white py-3 hover:bg-dark" @click="onLogin">로그인</button>
        <router-link to="/register">
            <button class="text-primary">계정이 없으신가요? 회원가입 하기</button>
        </router-link>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { auth, USER_COLLECTION } from '../firebase'
import {useRouter} from 'vue-router'
import store from '../store'

export default {
    name: 'TwitterCloneRegister',

    setup() {
        const email = ref('');
        const password = ref('');
        const loading = ref(false);
        const router = useRouter();

        const onLogin = async () => {
            if (!email.value || !password.value) {
                alert("이메일, 비밀번호를 모두 입력해 주세요.");
                return;
            }

            try {
                loading.value = true;
                const {user} = await auth.signInWithEmailAndPassword(email.value, password.value)

                // get user info
                const doc = await USER_COLLECTION.doc(user.uid).get()
                store.commit("SET_USER", doc.data())

                // 로그인 후 뒤로가기 했을 경우 다시 로그인을 해야하는 버그가 발생함
                // push는 뒤로가기가 가능하지만, replace 는 뒤로가기 막음
                router.replace("/");
            } catch (e) {
                switch (e.code) {
                    case "auth/invalid-email":
                        alert("잘못된 이메일 형식입니다.");
                        break;
                    case "auth/wrong-password":
                        alert("비밀번호를 확인해주세요.");
                        break;
                    case "auth/user-not-found":
                        alert("등록되지 않은 이메일입니다.");
                        break;
                    default:
                        alert(e.message);
                }
            } finally {
                loading.value = false;
            }
        }

        return {
            email, password, loading, onLogin
        }
    },
};
</script>

<style lang="scss" scoped>

</style>