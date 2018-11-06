// 数据绑定的入口
function Mvvm (options = {}) {
  var self = this;
  this.data = options.data;
  this.methods = options.methods;
  object.keys(data).forEach(function (key) {
      self.proxyKeys(key); // 绑定代理属性
  })
  observe(this.data);
  new Compile(options.el, this);
  options.mounted.call(this);
}

Mvvm.prototype = {
    proxyKeys: function (key) {
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter () {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        })
    }
}