// 比较两棵树的差异 同一个层级的元素进行对比
// 定义几种差异类型
import {StateEnums, isString, move} from './util'
import Element from './element'

export default function diff (oldTree, newTree) {
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
         if (props.length) curPatches.push({type: StateEnums.changeProps, props});
         // 遍历子树
         diffChildren(oldNode.children, newNode.children, index, patches);
       } else {
           // 节点不同，需要替换
           curPatches.push({type: StateEnums.replace, node: newNode})
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
        type: StateEnums.Remove,
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
          type: StateEnums.Insert,
          node: item,
          index: i
        })
        list.splice(i, 0, key)
      } else {
        // 找到了，需要判断是否需要移动
        console.log(key)
        if (index !== i) {
          changes.push({
            type: StateEnums.Move,
            from: index,
            to: i
          })
          move(list, index, i)
        }
      }
    })
    return { changes, list }
}


function isString(str) {
    return typeof str === 'String';
}
