// 引入mock.js，不使用时注释掉，build前要注释掉
// import '@/mock'
/*global chrome*/
// 请求服务器地址（开发环境模拟请求地址）
let API_DOMAIN = "http://192.168.22.141:5000/";
// 请求服务器地址（正式build环境真实请求地址）
if (import.meta.env.MODE === "production") {
  API_DOMAIN = "http://192.168.22.141:5000/";
}

// API请求正常，数据正常
export const API_CODE = {
  // API请求正常
  OK: 200,
  // API请求正常，数据异常
  ERR_DATA: 403,
  // API请求正常，空数据
  ERR_NO_DATA: 301,
  // API请求正常，登录异常
  ERR_LOGOUT: 401,
};
// API请求异常报错内容
export const API_FAILED = "网络连接异常，请稍后再试";

// API请求汇总
export const apiReqs = {
  // 登录
  signIn: (config) => {
    config.url = API_DOMAIN + "login/";
    config.method = "post";
    apiFetch(config);
  },
  // 获取数据
  getData: (config) => {
    config.url = API_DOMAIN + "getcookies";
    config.method = "get";
    apiFetch(config);
  },
  // 委托background提交数据
  submitByBackground: (config) => {
    config.background = true;
    config.url = API_DOMAIN + "submit/";
    config.method = "post";
    apiFetch(config);
  },
};

// 发起请求
function apiFetch(config) {
  if (config.background && import.meta.env.MODE === "production") {
    // [适用于build环境的content script]委托background script发起请求，此种方式只能传递普通json数据，不能传递函数及file类型数据。
    sendRequestToBackground(config);
  } else {
    // [适用于popup及开发环境的content script]发起请求
    apiRequest(config);
  }
}

/*
 * API请求封装（带验证信息）
 * config.method: [必须]请求method
 * config.url: [必须]请求url
 * config.data: 请求数据
 * config.formData: 是否以formData格式提交（用于上传文件）
 * config.success(res): 请求成功回调
 * config.fail(err): 请求失败回调
 * config.done(): 请求结束回调
 */
export function apiRequest(config) {
  // 如果没有设置config.data，则默认为{}
  if (config.data === undefined) {
    config.data = {};
  }

  // 如果没有设置config.method，则默认为post
  config.method = config.method || "post";

  // 请求头设置
  let headers = {};
  let data = null;

  if (config.formData) {
    data = new FormData();
    Object.keys(config.data).forEach(function (key) {
      data.append(key, config.data[key]);
    });
  } else {
    headers["Content-Type"] = "application/json;charset=UTF-8";
    data = JSON.stringify(config.data);
  }

  let axiosConfig = {
    method: config.method,
    headers,
  };

  if (config.method === "post") {
    axiosConfig.body = data;
  }

  fetch(config.url, axiosConfig)
    .then((res) => res.json())
    .then((result) => {
      config.done && config.done();
      config.success && config.success(result);
    })
    .catch(() => {
      config.done && config.done();
      config.fail && config.fail(API_FAILED);
    });
}

function sendRequestToBackground(config) {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage(
      {
        contentRequest: "apiRequest",
        config: config,
      },
      (result) => {
        config.done && config.done();
        if (result.result === "succ") {
          config.success && config.success(result);
        } else {
          config.fail && config.fail(result.msg);
        }
      }
    );
  } else {
    console.log("未找到chrome API");
  }
}
