// 比较两棵树的差异

function diff (oldTree, newTree) {
    var index = 0; // 当前节点的标志
    var patches = {} // 用来记录每个节点的差异对象
    dfs(oldTree, newTree, index, patches);
    return patches;
}

// 深度优先遍历，记录差异
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
           curPatches.push({type: StateEnums.replace, node: newNode})
       }
   }
}

// 判断属性的更改
function diffProps(oldProps, newProps) {
    // 1.先遍历oldProps查看是否存在删除的属性
    // 2.然后遍历newProps是否有属性值被修改
    // 3.最后查看是否有属性新增
    let change = []
    for (const key in oldProps) {
        if (oldProps.hasOwnProperty(key) && !newProps[key]) {
            change.push({prop: key});
        }
    }

    for (const key in newProps) {
        if(newProps.hasOwnProperty(key)) {
            const prop = newProps[key];
            if (oldProps[key] && oldProps[key] !== newProps[key]) {
                change.push({prop:key, value: newProps[key]});
            } else if (!oldProps[key]) {
                change.push({prop: key, value: newProps[key]});
            }
        }
    }
    return change;
}

// 判断列表差异算法
// 1.遍历旧的节点列表，查看每个节点是否存在在新的节点列表中
// 2.遍历新的节点列表，判断是否有新的节点
// 3.在第二步中同时判断节点是否有移动

function listDiff (oldList, newList, index, patches) {
    // 为了遍历方便，先取出所有的key
    let oldKeys = getKeys[oldList];
    let newKeys = getKeys[newList];
    let change = [];

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
    let length = list.length;
    for (let i = length - 1; i >= 0; i--) {
        if (!list[i]) {
           list.splice(i, 1)
           change.push({
               type: StateEnums.Remove,
               index: 1
           }) 
        }
    }

    newList && newList.forEach((item, i) => {
        let key = item.key
        if (isString(item)) {
            key = item
        }
        let index = list.indexOf(key)

        if (index === -1 || key === null) {
            change.push({
                type: StateEnums.Insert,
                node: item,
                index: i
            })
            list.splice(i, 0, key);
        } else {
            if (index !== i) {
                change.push({
                    type: StateEnums.Move,
                    form: index,
                    to: i
                })
            }
            move(list, index, i);
        }
    })

    return {changes, list}
}

function getKeys(list) {
    let keys = []
    let text
    list && list.forEach(item => {
        let key
        if (isString(item)) {
            key = [item];
        } else if (item instanceof Element) {
            item.key
        }
        keys.push(key)
    })

    return keys;
}

// 遍历子元素打标识
function diffChildren(oldChild, newChild, index, patches) {
    let {changes, list} = listDiff(oldChild, newChild, index, patches);
    if (changes.length) {
        if (patches[index]) {
            patches[index] = patches[index].concat(changes);
        } else {
            patches[index] = changes
        }
    }
    // 记录上一个遍历节点
    let last = null
    oldChild && oldChild.forEach((item, i) => {
        let child = item && item.children;
        if (child) {
           index = last && last.children ? index + last.children.length + 1 : index + 1;
           let keyIndex = list.indexOf(item.key);
           let node = newChild[keyIndex]

           if (node) {
               dfs(item, node, index, patches);
           }
        } else index += 1
        last = item
    })
}
