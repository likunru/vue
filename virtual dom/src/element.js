// js对象结构模拟dom结构

// 用js模拟dom
/**
 * @param {String} tag 'div'
 * @param {Object} props { class: 'item' }
 * @param {Array} children [{tagName: 'li', props: {class: 'item'}, children: []}]
 * @param {String} key option
 */
import { isString } from './util';

export default function Element(tagName, props, children, key) {
    this.tagName = tagName; // 元素名称
    this.props = props; // 元素属性
    if (isString(children)) {
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