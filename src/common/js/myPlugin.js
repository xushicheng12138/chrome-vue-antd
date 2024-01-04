/*global chrome  全局*/
import { ref, readonly } from "vue";
const globalMethods = {
  getStorage: ref((name, callback) => {
    // 获取存储
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([name], (result) => {
        if (callback) {
          callback(result[name]);
        }
      });
    } else {
      console.error("Chrome对象不存在，无法读取cookie。");
    }
  }),
  setStorage: ref((data) => {
    // 设置存储
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set(data, () => {
        console.log("Value is set:", data);
      });
    } else {
      console.error("Chrome对象不存在，无法设置cookie。");
    }
  }),
  delAllStorage: ref(() => {
    // 删除所有存储
    chrome.storage.sync.clear(function () {
      console.log("All Storage has been removed.");
    });
  }),
};
export const MyPlugin = {
  install(app) {
    app.provide("globalMethods", readonly(globalMethods));
  },
};
