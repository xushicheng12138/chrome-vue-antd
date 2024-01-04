import { createApp } from "vue";
// 全局样式
import "@/common/styles/mainList.css";
import "@/common/styles/frame.styl";
import "ant-design-vue/dist/reset.css";
import Antd from "ant-design-vue";
import Popup from "@/popup/popup.vue";
import router from "./router";
// 提供全局方法
import { MyPlugin } from "@/common/js/myPlugin";
const app = createApp(Popup);
app.use(MyPlugin);
app.use(Antd);
app.use(router);
app.mount("#app");
