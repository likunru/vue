flex 布局

分为两部分：
1.主轴和交主轴
2.父容器和子容器


父容器：
justify-content: flex-start/flext-end/center/space-between/space-around

align-item: flex-start/flex-end/center/baseline/stretch

flex-wrap: nowrap/wrap/wrap-reverse

flex-flow(flex-direction和flex-wrap结合)： row wrap/

align-content: flex-start/flex-end/center/space-between/space-arround/stretch

flex-direction: row/column/row-reverse/column-reverse

子容器：
flex-basis/flex-grow/flex-shink
align-self: flex-start/flex-start/center/baseline/stretch
flex-basis: 设置基准大小
flex-grow:设置扩展比例
flex-shink: 设置伸缩比例
order: 数字越小排列越靠前


ES7:
1、indexOf/ includes
2、指数运算符：** === Math.pow(2,10)


ES8:
1、async/awit
2、Promise.all() 接收一个数组，
3、Object.values()  返回object自身属性的所有值，不包括继承的值。
4、Object.entries() 返回一个给定对象自身可枚举属性的键值对的数组。
5、String padding：String.prototype.padStart  / String.prototype.padEnd 允许空字符串或其他字符串添加到原始字符串的开头或结尾。
6、Object.getOwnPropertyDescriptors()  返回一个对象的所有自身属性的描述符，如果没有任何自身属性，则返回空对象。


ES6:
1、class(面向对象编程) extend  super()
2、模块化
3、箭头函数（箭头函数没有this,它的this是外层第一个调用它的函数的this）
4、函数参数默认值
5、模板字符串  var name = 'your name is $[first} ${lase}.'
6、解构赋值
7、延展操作符（...）
8、对象属性简写
9、promise
10、let / const 块级作用域   var 函数作用域



vue.js

1、mvvm 数据双向绑定，数据劫持（observe.js Object.defineProperty）+ 发布订阅模式(watch.js)
2、虚拟dom, 用js模拟虚拟dom树，对比两颗树的差异，把差异作用在真实dom树上。
3、路由： hash/history  (DOM替换方式更改页面的内容)
   hash: 监听路由的的变化  location.hash.slice(1)  hashChange事件
   history:  history.replaceState   history.pushState   history.popState

网站性能优化
1、 网络传输性能：使用浏览器缓存/资源打包压缩/图片资源优化/cdn缓存
2、 页面渲染性能： DOM渲染层与GPU硬件加速/重排和重绘
3、 js阻塞性能


js运行机制
1.浏览器内核（渲染进程）

渲染进程： gui渲染线程、js引擎线程、事件循环线程、异步http请求线程、定时触发器线程

2.webWorker: 相当于给js引擎单独开了一个线程，用来执行复杂运算。只属于一个页面，不会和其他页面的render进程共享
  shareWorker: 是浏览器所有页面共享的。一个进程

3.宏任务和微任务

4.js分为同步任务和异步任务，同步任务都在主线程上执行，形成一个执行栈，主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
  一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。


js原型和原型链 （obj.__proto__ === function.prototype）
1.每个对象都有一个__proto__属性
2.每个函数都有一个prototype属性。functionA.prototype.constructor = functionA
3.hasOwnProperty()：判断某个属性(这个属性指的是自有属性非继承属性)是否存在于某个对象中。 obj.hasOwnProperty('name')
4.instanceOf  var d = new Date()  d instanceOf Date
5.isPrototypeOf： 检测一个对象是否是另一个对象的原型。或者说一个对象是否被包含在另一个对象的原型链中。Date.prototype.isPrototypeOf(d)   var p = {x:1} p.isPrototypeOf(d);


new
1.创建一个空对象   let obj = Object.create()
2.把对象链接到原型链  let Con = [].shift.call(arguments)  obj.__proto__ = Con.prototype
3.给这个对象绑定this  let result = Con.apply(obj, arguments)
4.返回这个新对象     return typeof result === "object" ? result : obj


执行上下文（全局执行上下文，函数执行上下文，eval执行上下文），在生成一个执行上下文的时候，包括两个阶段：1.创建阶段（创建vo） 2.代码执行阶段
一、一个执行上下文包括变量对象、作用域和this
1、变量对象(VO): 变量的声明、函数和形参的声明
2、作用域：包括自身变量对象和上级变量对象列表。通过[scope]属性查找上级变量对象。
3、this： call/apply/bind   call第二个参数是一个参数列表；apply第二个参数是一个参数数组；bind不会立即执行，会返回一个新的引用






this.$set(this.gictable[i], 'status_str', Data[gId].status_str)