// 数据绑定的入口
function MVVM (options) {
  var self = this;
  this.$options = options || {};
  var data = this._data = options.data;

  // 数据代理 使用object.defineProperty
  Object.keys(data).forEach(function (key) {
      self.proxyKeys(key); // 绑定代理属性
  })
  this._initComputed();
  // 给每个属性添加setter\getter
  observe(data, this);
  //初始化视图，编译挂载的根元素
  this.$compile = new Compile(options.el || document.body, this);
  // 实现mounted钩子函数
  options.mounted.call(this);
}

MVVM.prototype = {
    $watch: function (key, cb, options) {
       new Watcher(this, key, cb);
    },
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter () {
                return self._data[key];
            },
            set: function proxySetter(newVal) {
                self._data[key] = newVal;
            }
        })
    },
    _initComputed: function () {
        var self = this,
            computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(self, key, {
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set: function () {}
                })
            })
        }    
    }
}