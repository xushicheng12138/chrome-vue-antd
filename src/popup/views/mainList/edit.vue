<template>
    <div style="padding:18px">
        <a-page-header sub-title="编辑" />
        <a-form name="add" :model="addFrom" @finish="onFinish">
            <a-form-item label="name" name="name" :rules="[{ required: true, message: '请输入!' }]">
                <a-input v-model:value="addFrom.name" />
            </a-form-item>
            <a-space v-for="(sight, index) in addFrom.cookiesArr" :key="sight.id" style="display: flex; margin-bottom: 8px">
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
                <MinusCircleOutlined @click="removeSight(sight)" style="margin-bottom:24px"/>
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
import { useRouter, useRoute } from 'vue-router'
import { reactive, inject } from 'vue';
const methods = inject('globalMethods');
const router = useRouter()
const route = useRoute()
const { name, cookiesArr } = JSON.parse(route.query.row)
const addFrom = reactive({
    cookiesArr: cookiesArr?cookiesArr:[],
    name: name,
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

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

const updateItem = (arr, newItem) => {
    // 更新数据 名称相同则替换   不同则添加
    const existingItemIndex = arr.findIndex(item => item.name === newItem.name);
    if (existingItemIndex !== -1) {
        arr[existingItemIndex] = newItem;
    } else {
        arr.unshift(newItem);
    }
    return arr;
}

const onFinish = async values => {
    // 取出存储
    methods.getStorage(('cookie'), async (data) => {
        let newdata = [];
        if (Array.isArray(data) && data.length > 0 && !isEmptyObject(data)) {
            newdata = await updateItem(data, values)
        } else {
            newdata = [values];
        }
        // 存储数据
        await methods.setStorage({ 'cookie': newdata });
        console.log('newdata is', newdata)
        router.push('/mainList')
    });
};

</script>