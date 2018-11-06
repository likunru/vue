// 数据劫持
// 给属性添加setter、getter方法以及订阅器 Dep（储存订阅者）

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    object.keys(data).array.forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
}
function defineReactive(data, key, val) {
   observe(val); // 遍历所有子属性
   var dep = new dep();
   object.defineProperty(data, key, {
       enumerable: true,
       configurable: true,
       set: function (newVal) {
           if (val === newVal) {
               return;
           }
           val = newVal;
           dep.notify(); // 属性变化，通知所有订阅者
       },
       get: function () {
           if (Dep.target) { // 当前订阅者存在时
               dep.addSub(watcher); // 添加一个订阅者
           }
           return val;
       }
   })
}
// 订阅器，存放订阅者
function Dep () {
    this.subs = [];
}
Dep.prototype = {
    // 添加订阅者函数
    addSub: function (watcher) {
        this.subs.push(watcher);
    },
    // 通知订阅者函数
    notify: function () {
        this.subs.forEach(function(sub) {
            sub.update(); // 订阅者更新视图
        })
    }
}
Dep.target = null