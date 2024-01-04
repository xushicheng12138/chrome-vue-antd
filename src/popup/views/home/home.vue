<template>
    <div style="padding:18px">
        <a-form name="add" :model="addFrom" @finish="onFinish">
            <a-form-item label="name" name="name" :rules="[{ required: true, message: '请输入!' }]">
                <a-input v-model:value="addFrom.name" />
            </a-form-item>
            <a-space v-for="(sight, index) in addFrom.cookiesArr" :key="sight.id" style="display: flex; margin-bottom: 8px">
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
                <MinusCircleOutlined @click="removeSight(sight)" />
            </a-space>
            <a-form-item>
                <a-button type="dashed" block @click="addSight">
                    <PlusOutlined />
                    添加cookie
                </a-button>
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button type="primary" html-type="submit">Submit</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup>
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { reactive } from 'vue';
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
        value: undefined,
        name: undefined,
        id: Date.now(),
    });
};

const setStorage = (data) => {
    // 存储
    if (window.chrome && window.chrome.storage && window.chrome.storage.sync) {
        window.chrome.storage.sync.set(data, () => {
            console.log("Value is set:", data);
        });
    } else {
        console.error('Chrome对象不存在，无法设置cookie。');
    }
}

const getStorage = (name, callback) => {
    // 取出存储
    if (window.chrome && window.chrome.storage && window.chrome.storage.sync) {
        window.chrome.storage.sync.get([name], (result) => {
            if (callback) {
                callback(result[name]);
            }
        });
    } else {
        console.error('Chrome对象不存在，无法读取cookie。');
    }
}

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

const onFinish = async values => {
    // 取出存储
    getStorage(('cookie'), async (data) => {
        let newdata = [];
        if (data && !isEmptyObject(data)) {
            newdata = [...data, values]; // 使用展开运算符创建新数组
        } else {
            newdata = [values];
        }
        // 存储数据
        await setStorage({ 'cookie': newdata });
        console.log('newdata is', newdata)
        router.push('/mainList')
    });
};

</script>