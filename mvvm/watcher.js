// 实例化watcher 
// watcher 包含绑定着data对应值的节点 还有接收到通知，则调用函数更新改节点视图
// 发布者就是vm中data的某个属性的getter   订阅者 绑定着data对应值的节点

function Watcher (vm, expOrFn, cb) {
    this.cb = cb; // 回调函数，数据变化时所执行的操作
    this.vm = vm; 
    // 指令值字符串， v-html = " a ? b : c" 或者 v-html = "a.b.c"
    // 所以该指令字符串 可以是一个表达式字符串，通过某种转换，传进来的可能为function
    this.expOrFn = expOrFn; // 属性名
    // 订阅器的id
    this.depIds =  {};
    
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.getter = this.parseGetter(expOrFn);
    }
    this.value = this.get(); // 将自己添加到订阅器操作
}
Watcher.prototype = {
   // 数据变化所执行的操作
   update: function () {
       this.run();
   },
   run: function () {
       var value = this.get();
       var oldVal = this.value;
       if (value !== oldVal) {
           this.value = value;
           this.cb.call(this.vm, value, oldVal);
       }
   },
   // 添加订阅器
   addDep: function (dep) {
       // 每个订阅者都有this.depIds属性存放watcher所加入的dep的id
       // 初始化的时watcher的this.depIds = {}
       // 当修改value值的时候，判断this.depIds已经有这个dep.id，说明watcher已经添加到dep中，避免添加重复的订阅者
       if (!this.depIds.hasOwnProperty(dep.id)) {
           // 订阅器将该watcher实例添加到订阅者数组中
           dep.addSub(this);
           this.depIds[dep.id] = dep;
       }
   },
   get: function () {
       // Dep是一个订阅器，Dep.target为一个全局属性，默认为null，代表本次所添加进订阅器中的目标
       // 将本次订阅器的目标指定为该watcher
       Dep.target = this; // 缓存自己
       // 获取vm中指令字符串所对应的值，例如a.b.c ，此时触发了observer.js 中 24行
       // 即触发了 a.b.c的 getter函数
       var value = this.getter.call(this.vm, this.vm); // 获取数据，并在将自己添加到订阅器dep当中
       Dep.target = null;
       return value;
   },
   // a.b.c
   parseGetter: function (exp) {
       var exps = exp.split('.');
       return function (obj) {
           for (var i = 0, len = exps.length; i < len; i++) {
               if (!obj) return;
               obj = obj[exps[i]];
           }
           return obj;
       }
   }
}