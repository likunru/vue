// 实例化watcher 
// watcher 包含绑定着data对应值的节点 还有接收到通知，则调用函数更新改节点视图
// 发布者就是vm中data的某个属性的getter   订阅者 绑定着data对应值的节点

function Watcher (vm, exp, cb) {
    this.cb = cb; // 回调函数，数据变化时所执行的操作
    this.vm = vm; 
    this.exp = exp; // 属性名
    this.value = this.get(); // 将自己添加到订阅器操作
}
Watcher.prototype = {
   // 数据变化所执行的操作
   update: function () {
       this.run();
   },
   run: function () {
       value = this.vm.data[this.exp];
       var oldVal = this.value;
       if (value !== oldVal) {
           this.value = value;
           this.cb.call(this.vm, value, oldVal);
       }
   },
   get: function () {
       Dep.target = this; // 缓存自己
       var value = this.vm.data[this.exp]; // 获取数据，并在将自己添加到订阅器dep当中
       Dep.target = null;
       return value;
   }
}