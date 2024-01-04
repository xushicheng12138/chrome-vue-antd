import { createRouter, createWebHashHistory } from "vue-router";
import Add from "@/popup/views/mainList/add.vue";
import Edit from "@/popup/views/mainList/edit.vue";
import MainList from "@/popup/views/mainList/mainList.vue";
import Entry from "@/popup/views/entry/entry.vue";

const routes = [
  {
    path: "/",
    component: Entry,
    children: [
      {
        path: "add",
        component: Add,
        exact: true,
      },
      {
        path: "edit",
        component: Edit,
        exact: true,
      },
      {
        path: "mainList",
        component: MainList,
        exact: true,
      },
      { path: "", redirect: "mainList" },
      { path: "/:pathMatch(.*)", redirect: "mainList" },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
