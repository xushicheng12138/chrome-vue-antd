<template>
    <div style="padding:18px">
        <a-page-header sub-title="添加" />
        <a-form name="add" :model="addFrom" @finish="onFinish">
            <a-form-item label="name" name="name" :rules="[{ required: true, message: '请输入!' }]">
                <a-input v-model:value="addFrom.name" />
            </a-form-item>
            <a-space v-for="(sight, index) in addFrom.cookiesArr" :key="sight.id" style="display: flex;">
                <a-form-item :name="['cookiesArr', index, 'type']" label="type">
                    <a-radio-group v-model:value="sight.type">
                        <a-radio :value="1">cookie</a-radio>
                        <a-radio :value="2">header</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :name="['cookiesArr', index, 'name']" label="name" :rules="{
                    required: true,
                    message: 'Missing name',
                }">
                    <a-input v-model:value="sight.name" placeholder="cookie名称" />
                </a-form-item>
                <a-form-item label="value" :name="['cookiesArr', index, 'value']" :rules="{
                    required: true,
                    message: 'Missing value',
                }">
                    <a-input v-model:value="sight.value" placeholder="cookie值" />
                </a-form-item>
                <MinusCircleOutlined @click="removeSight(sight)" style="margin-bottom:24px" />
            </a-space>
            <a-form-item>
                <a-button type="dashed" block @click="addSight">
                    <PlusOutlined />
                    添加cookie
                </a-button>
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup>
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { reactive, inject } from 'vue';
import { message } from 'ant-design-vue';
const methods = inject('globalMethods');
const router = useRouter()
const addFrom = reactive({
    cookiesArr: [],
    name: '',
});
const removeSight = item => {
    const index = addFrom.cookiesArr.indexOf(item);
    if (index !== -1) {
        addFrom.cookiesArr.splice(index, 1);
    }
};
const addSight = () => {
    addFrom.cookiesArr.push({
        type: 1,//1 cookie 2 header
        value: undefined,
        name: undefined,
        id: Date.now(),
    });
};
const onFinish = async values => {
    // 提交
    methods.getStorage(('cookie'), async (data) => {
        let newdata = [];
        if (Array.isArray(data) && data.length > 0) {
            const existingName = data.findIndex(item => item.name === values.name);
            if (existingName !== -1) {
                message.error('name已存在')
                return
            }
            newdata = [values,...data];
        } else {
            newdata = [values];
        }
        // 存储数据
        await methods.setStorage({ 'cookie': newdata });
        router.push('/mainList')
    });
};
</script>