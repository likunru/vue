# mvvm
实现简单的数据双向绑定
单向数据绑定  
所谓单向数据绑定即model数据改变时通知view改变视图
双向数据绑定  
在单向数据绑定的基础给可输入元素（inpu、textare等）添加changge时间，来动态修改model和view。  

> 实现数据绑定的做法大致有如下几种：  
  > 发布者-订阅者模式（backbone.js）  
  > 脏值检查（angular.js）  
  > 数据劫持（vue.js）  
数据劫持（observe.js）
通过Object.definedProperty给每个属性添加set、get方法，这样在设置属性值和获取属性值的时候都可以监听到属性值的变化。
数据监听（watch.js）
1、获取值的时候把自己添加到订阅器Dep中；
数据编译（compile.js）
数据代理（mvvm.js）
