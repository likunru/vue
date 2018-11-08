/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = Element;
// js对象结构模拟dom结构

// 用js模拟dom
/**
 * @param {String} tag 'div'
 * @param {Object} props { class: 'item' }
 * @param {Array} children [{tagName: 'li', props: {class: 'item'}, children: []}]
 * @param {String} key option
 */


function Element(tagName, props, children, key) {
    this.tagName = tagName; // 元素名称
    this.props = props; // 元素属性
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* isString */])(children)) {
        this.key = children;
        this.children = children;
    } else {
      this.children = children; // 子元素
    }
    if (key) this.key = key
}

// 将jsDom渲染为真实的dom结构
Element.prototype.render = function () {
    // 创建节点
    var el = document.createElement(this.tagName);
    var props = this.props;
    
    // 给节点添加属性
    for (var propName in props) {
        var propValue = props[propName];
        el.setAttribute(propName, propValue);
    }
    // 设置每个节点的标识
    if (this.key) {
        el.setAttribute('key', this.key);
    }
    // 给父节点添加子节点

    var children = this.children || [];
    children.forEach(function(child){
        console.log(child, child instanceof Element);
        var childEl = (child instanceof Element) 
        ? child.render()  // 如果子节点是虚拟dom, 递归构建dom节点
        : document.createTextNode(child); // 如果是字符串，创建文本节点
        
        el.appendChild(childEl);
    })

    return el;
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StateEnums; });
/* harmony export (immutable) */ __webpack_exports__["b"] = isString;
/* harmony export (immutable) */ __webpack_exports__["c"] = move;
let StateEnums = {
    ChangeText: 0,
    ChangeProps: 1,
    Insert: 2,
    Move: 3,
    Remove: 4,
    Replace: 5
}

function isString(str) {
    return typeof str === 'string';
}

function move(arr, old_index, new_index) {
    while(old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        let k = new_index - arr.length;
        while (k-- + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__element__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = diff;
// 比较两棵树的差异 同一个层级的元素进行对比
// 定义几种差异类型



function diff (oldTree, newTree) {
    var index = 0; // 当前节点的标志
    var patches = {} // 用来记录每个节点的差异对象
    dfs(oldTree, newTree, index, patches);
    return patches;
}

// 判断两个树之间的差异
// 需要判断三种情况
// 1.没有新的节点什么都不用做
// 2.新的节点的tagName和key和旧的不同，替换
// 3.相同，遍历子节点
function dfs(oldNode, newNode, index, patches) {
   let curPatches = []; // 用于保存子树的更改
   if (!newNode) {
   } else {
       if (newNode.tagName === oldNode.tagName && newNode.key === oldNode.key) {
         // 判断属性是否更改
         let props = diffProps(oldNode.props, newNode.props)
         if (props.length) curPatches.push({type: __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].changeProps, props});
         // 遍历子树
         diffChildren(oldNode.children, newNode.children, index, patches);
       } else {
           // 节点不同，需要替换
           curPatches.push({type: __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].replace, node: newNode})
       }

       if (curPatches.length) {
           if (patches[index]) { // 当这个节点的差异已经存在,把差异合并到一个数组
               patches[index] = patches[index].concat(curPatches);
           } else {
               patches[index] = curPatches;
           }
       }
   }
}

// 判断属性的更改
// 1.先遍历oldProps查看是否存在删除的属性
// 2.然后遍历newProps是否有属性值被修改
// 3.最后查看是否有属性新增
function diffProps(oldProps, newProps) {
    let change = []
    for (const key in oldProps) {
        if (oldProps.hasOwnProperty(key) && !newProps[key]) { // 删除属性
            change.push({
                prop: key
            })
        }
    }
    for (const key in newProps) {
        if (newProps.hasOwnProperty(key)) {
            const prop = newProps[key];
            if (oldProps[key] && oldProps[key] !== newProps[key]) { // 属性值改变
                change.push({
                    prop: key,
                    value: prop
                })
            } else if (!oldProps[key]) { // 新增属性
                change.push({
                    prop: key,
                    value: prompt
                })
            }
        }
    }
    return change;
}
// 判断子元素差异
function diffChildren(oldChild, newChild, index, patches) {
    let { changes, list } = listDiff(oldChild, newChild, index, patches)
    if (changes.length) {
      if (patches[index]) {
        patches[index] = patches[index].concat(changes)
      } else {
        patches[index] = changes
      }
    }
    // 记录上一个遍历过的节点
    let last = null
    oldChild &&
      oldChild.forEach((item, i) => {
        let child = item && item.children
        if (child) {
          index =
            last && last.children ? index + last.children.length + 1 : index + 1
          let keyIndex = list.indexOf(item.key)
          let node = newChild[keyIndex]
          // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
          if (node) {
            dfs(item, node, index, patches)
          }
        } else index += 1
        last = item
      })
}
// 判断子元素节点列表差异算法
// 1.遍历旧的节点列表，查看每个节点是否存在在新的节点列表中
// 2.遍历新的节点列表，判断是否有新的节点
// 3.在第二步中同时判断节点是否有移动
// {tagName: 'li', props: {class: 'item'}, children: [
//   {tagName: 'li', props: {class: 'item'}, children: []},
//   {tagName: 'li', props: {class: 'item'}, children: []},
// ]},
function listDiff (oldList, newList, index, patches) {
    // 为了遍历方便，先取出所有的key
    let oldKeys = getKeys[oldList];
    let newKeys = getKeys[newList];
    let change = [];
     
    // 用于保存变更后的节点数据
    // 使用该数组保存有以下好处
    // 1.可以正确获得被删除节点索引
    // 2.交换节点位置只需要操作一遍 DOM
    // 3.用于 `diffChildren` 函数中的判断，只需要遍历
    // 两个树中都存在的节点，而对于新增或者删除的节点来说，完全没必要
    let list = []
    oldList && oldList.forEach(item => {
        let key = item.key
        if (isString(item)) {
            key = item
        }
        
        let index = newKeys.indexOf(key)
        if (index === -1) { // 说明该节点被删除了
          list.push(null)
        } else list.push(key)
    }) 
      // 遍历变更后的数组
  let length = list.length
  // 因为删除数组元素是会更改索引的
  // 所有从后往前删可以保证索引不变
  for (let i = length - 1; i >= 0; i--) {
    // 判断当前元素是否为空，为空表示需要删除
    if (!list[i]) {
      list.splice(i, 1)
      changes.push({
        type: __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Remove,
        index: i
      })
    }
  }
  // 遍历新的 list，判断是否有节点新增或移动
  // 同时也对 `list` 做节点新增和移动节点的操作
  newList &&
    newList.forEach((item, i) => {
      let key = item.key
      if (isString(item)) {
        key = item
      }
      // 寻找旧的 children 中是否含有当前节点
      let index = list.indexOf(key)
      // 没找到代表新节点，需要插入
      if (index === -1 || key == null) {
        changes.push({
          type: __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Insert,
          node: item,
          index: i
        })
        list.splice(i, 0, key)
      } else {
        // 找到了，需要判断是否需要移动
        console.log(key)
        if (index !== i) {
          changes.push({
            type: __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Move,
            from: index,
            to: i
          })
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* move */])(list, index, i)
        }
      }
    })
    return { changes, list }
}


function isString(str) {
    return typeof str === 'String';
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__element__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = patch;
// 渲染差异



let index = 0
function patch(node, patchs) {
  let changes = patchs[index]
  let childNodes = node && node.childNodes
  // 这里的深度遍历和 diff 中是一样的
  if (!childNodes) index += 1
  if (changes && changes.length && patchs[index]) {
    changeDom(node, changes)
  }
  let last = null
  if (childNodes && childNodes.length) {
    childNodes.forEach((item, i) => {
      index =
        last && last.children ? index + last.children.length + 1 : index + 1
      patch(item, patchs)
      last = item
    })
  }
}

function changeDom(node, changes, noChild) {
  changes &&
    changes.forEach(change => {
      let { type } = change
      switch (type) {
        case __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].ChangeProps:
          let { props } = change
          props.forEach(item => {
            if (item.value) {
              node.setAttribute(item.prop, item.value)
            } else {
              node.removeAttribute(item.prop)
            }
          })
          break
        case __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Remove:
          node.childNodes[change.index].remove()
          break
        case __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Insert:
          let dom
          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* isString */])(change.node)) {
            dom = document.createTextNode(change.node)
          } else if (change.node instanceof __WEBPACK_IMPORTED_MODULE_1__element__["a" /* default */]) {
            dom = change.node.create()
          }
          node.insertBefore(dom, node.childNodes[change.index])
          break
        case __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Replace:
          node.parentNode.replaceChild(change.node.create(), node)
          break
        case __WEBPACK_IMPORTED_MODULE_0__util__["a" /* StateEnums */].Move:
          let fromNode = node.childNodes[change.from]
          let toNode = node.childNodes[change.to]
          let cloneFromNode = fromNode.cloneNode(true)
          let cloenToNode = toNode.cloneNode(true)
          node.replaceChild(cloneFromNode, toNode)
          node.replaceChild(cloenToNode, fromNode)
          break
        default:
          break
      }
    })
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__diff__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__patch__ = __webpack_require__(3);




let test6 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, ['test6'], 'test6')
let test7 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, [test6, 'test7'], 'test7')
let test77 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, ['test77'], 'test7')
let test8 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, ['test8'], 'test8')

let test3 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, [test6, test7, 'test3'], 'test3')
let test33 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, [test77, 'text33', test8], 'test3')

let test4 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, ['test4'])
let test5 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('ul', { class: 'my-div' }, ['test5'])

let test1 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { class: 'my-div' }, [test4])

let test2 = new __WEBPACK_IMPORTED_MODULE_0__element__["a" /* default */]('div', { id: '11' }, [test5, test4])

let root = test1.render()

let pathchs = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__diff__["a" /* default */])(test1, test2)
console.log(pathchs)

setTimeout(() => {
  console.log('开始更新')
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__patch__["a" /* default */])(root, pathchs)
  console.log('结束更新')
}, 1000)

/***/ })
/******/ ]);