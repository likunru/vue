// js对象结构模拟dom结构

// 用js模拟dom
function Element(tagName, props, children) {
    // if (!(this instanceof Element)) {
    //     if ()
    // }
     
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
}

// 将jsdom渲染为真实的dom结构
Element.prototype.render = function () {
    // 创建节点
    var el = document.createElement(this.tagName);
    var props = this.props;
    
    // 给节点添加属性
    for (var propName in props) {
        var propValue = props[propName];
        el.setAttrbute(propName, propValue);
    }

    // 给父节点添加子节点

    var children = this.children || [];
    children.forEach(function(child){
        var childEl = (child instanceof Element) 
        ? child.render  // 如果子节点是虚拟dom, 递归构建dom节点
        : document.createTextNode(child); // 如果是字符串，创建文本节点
    })

    return el;
}

module.exports = function (tagName, props, children) {
    return new Element(tagName, props, children)
}