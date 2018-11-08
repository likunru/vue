// 数据劫持
// 给属性添加setter、getter方法以及订阅器 Dep（储存订阅者）

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
}
// 使用object.defineProperty进行拦截
function defineReactive(data, key, val) {
   observe(val); // 遍历所有子属性
   var dep = new Dep();
   Object.defineProperty(data, key, {
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
               dep.depend(); // 添加一个订阅器
           }
           return val;
       }
   })
}
// 订阅器，存放订阅者
var uid = 0; // 订阅器id
function Dep () {
    // 订阅器id
    this.id = uid++;
    // 订阅者列表
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
    },
    depend: function () {
        // Dep.target 代表的是watcher， 转入watcher addDep方法
        // this代表Dep实例  
        // 这里明明可以直接执行 this.addSub(Dep.target) 为什么还要将执行权交回给Watcher实例？
        // 这里watcher实例的addDep方法可以得到订阅器Dep实例，
        // 从而watcher实例可以判断dep.id是否存在于 [watcher实例的被添加进入的订阅器id对象](this.depIds)
        // 如果存在，则该订阅器不重复添加该watcher作为订阅者
        // 如果不存在， 该订阅器添加watcher作为订阅者，并将该dep.id添加入this.depIds里
        Dep.target.addDep(this);
    }
}
Dep.target = null