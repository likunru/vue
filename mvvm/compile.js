// 解析el
// vm: 视图模型
// exp：指令值对应的字符串

// MVVM中使用方法 this.$compile = new Compile(options.el || document.body, this)
// 主要功能： 解析元素中的各种指令并赋予对应的功能

function Compile(el, vm) {
    // $vm mvvm实例本身
    this.$vm = vm
    // 获取传入的根元素
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      // 将所有实际元素转化为元素碎片，操作效率高
      this.$fragment = this.node2Fragment(this.$el);
      // 执行具体变异操作
      this.init();
      // 将碎片还原到实际dom上
      this.$el.appendChild(this.$fragment);
    }
}
Compile.prototype = {
    node2Fragment: function (el) {
        var fragment = document.createDocumentFragment(), child; // 创建文档碎片
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },
    // 编译碎步
    init: function () {
        this.compileElement(this.$fragment);
    },
    // 编译每一个节点，如果是文本节点采用文本编译方式，元素采用元素编译方式，子节点递归下去
    compileElement: function (el) { 
        var childNodes = el.childNodes,
            self = this; 
        [].slice.call(childNodes).forEach(function(node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent; // 获取该节点的文本内容
            if (self.isTextNode(node) && reg.test(text)) { // 判断是否是文本节点
                self.compileText(node, trim(RegExp.$1)) // reg.exec() === RegExp.$1获取到的是匹配到的第一个字段
            } else if (self.isElementNode(node)) { // 判断是否是元素节点
                self.compile(node);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node); // 递归遍历子节点
            }
        })
    },
    // 编译元素节点
    compile: function (node) {
        var nodeAttrs = node.attributes, // 获取元素属性列表
            self = this;
        // 变量元素所有属性节点  
        [].slice.call(nodeAttrs).forEach(function (attr) {
            var attrName = attr.name;
            // 判断属性是否是vue属性
            if (self.isDirective(attrName)) {
                // 获取属性值
                var exp = trim(attr.value);
                // 获取属性的具体含义 html v-if
                var dir = attrName.substring(2); // 这里获取到的是if
                if (self.isEventDirective(dir)) {// 判断是否是事件指令
                    // 执行事件指令的编译方式
                    compileUtil.eventHandler(node, self.$vm, exp, dir);
                } else {
                    // 执行普通指令的编译方式
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp);
                }
            }
        })    
    },
    // 编译文本节点 node.nodeType 元素节点返回1；文本节点返回3；属性节点返回2；
    compileText: function (node, exp) {
        // 采用文本编译包中的指令处理方法
        compileUtil.text(node, this.$vm, exp);
    },
    isDirective: function (attr) { // 判断是否是指令
        return attr.indexOf('v-') == 0
    },
    isEventDirective: function (dir) { // 判断是否是事件指令
        return dir.indexOf('on') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function (node) {
        return node.nodeType == 3;
    }
} 

// 指令处理集合
var compileUtil = {
    // v-text || 文本节点{{xxx}}的处理方式
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    // v-html处理方式
    html: function (node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    // v-model指令处理方式
    model: function (node, vm, exp) {
        this.bind(node, vm, exp, 'model');
        var self = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) {
            var newVal = e.target.value;
            if (val === newVal) {
                return;
            }
            self._setVMVal(vm, exp, newVal);
            val = newVal;
        })    
    },
    // v-class指令处理方式
    class: function (node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
    // v-bind的指令处理方式，以及代理其他指令的处理方式
    bind: function (node, vm, exp, dir) {
        // 获取对应指令的内容更新函数
        var updaterFn = updater[dir + 'Updater'];
        // 利用updater[htmlUpdater]给a元素的内容进行初始化
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
        // 添加观察者实例，一旦有值变化则启动更新函数
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        })
    },
    // 事件处理
    eventHandler: function (node, vm, exp, dir) {
        // 获取v-on具体绑定的是什
        var eventType = dir.split(':')[1],
           // 获取具体事件触发函数
           fn = vm.$options.methods && vm.$options.methods[exp];

        // 绑定原生事件
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        } 
    },
    // 获取指令值字符串所对应到vm中的值， 例：v-html="a.b.c"，则a.b.c就是指令值字符串，则应该获得vm中的a.b.c的值
    // 例： vm = { a: { b: { c: 3 } } };
    _getVMVal: function (vm, exp) { // exp = 'a.b.c'
        var val = vm;
        exp = exp.split('.');
        // [a, b, c]
        exp.forEach(function (k) {
            val = val[k];
        })
        return val;
    },
    // 设置指令值字符串所对应的vm中的值，假设value为999
    _setVMVal: function (vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key, 更新value值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        })
    }
};

// 指令所对应的更新函数
var updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    htmlUpdater: function (node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },
    classUpdater: function (node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';
    },
    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '': value;
    }
}

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}