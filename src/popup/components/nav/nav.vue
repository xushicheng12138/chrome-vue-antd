<template>
    <div class="M-nav">
        <a-tabs v-model="path" type="card" @tabClick="onTabChange">
            <a-tab-pane key="/mainList" tab="主页"></a-tab-pane>
            <!-- <a-tab-pane key="/mainList" tab="在线CooKie"></a-tab-pane> -->
        </a-tabs>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { watchEffect, ref } from 'vue';
const router = useRouter()
const path = ref('')
watchEffect(() => {
    path.value = router.currentRoute.value.path
});
const onTabChange = (gotoPath) => {
    router.push(gotoPath)
}
</script>
<style scoped lang="stylus">
.M-nav
    position: relative
    z-index: 999
    background: #fff
</style>