class HasRoute {
    // 构造函数
    constructor () {
      // 声明一个routes以键值对的形式存放路由
      this.routes = {};
      // 当前url
      this.currentUrl = '';
      // 存放出现过hash
      this.history = [];
      // 指向this.history末尾
      this.currentIndex = this.history.length - 1;
      this.route = this.route.bind(this);
      this.backOff = this.backOff.bind(this);
      this.go = this.go.bind(this);
      // 是否是回退
      this.isBack = false;
      // 前进标识
      this.isGo = false;
      // 刷新页面的时候使用load事件 
      window.addEventListener('load', this.route, false);
      // 回退和直接输入链接跳转的时候使用hashchange监听
      window.addEventListener('hashchange', this.route, false);
    }
    //path路径和对应的callback函数储存
    setRoute (path, callback) {
      this.routes[path] = callback;
    }
    // 执行相应的callback
    route () {
      this.currentUrl = location.hash.slice(1) || '/';
      if (!this.isBack && !this.isGo) {
        this.history.push(this.currentUrl);
        this.currentIndex++;
      }
      //执行当前hash路径的callback函数 
      this.routes[this.currentUrl]();
      this.isBack = false;
      this.isGo = false;
    }
    // 后退
    backOff () {
       this.isBack = true; 
       this.currentIndex <= 0 ? 0 : (this.currentIndex = this.currentIndex - 1);
       // 随着后退，location.hash也随之变化
       location.hash = this.history[this.currentIndex]
       this.routes[this.history[this.currentIndex]]();
    }
    // 前进
    go () {
        this.isGo = true;
        this.currentIndex >= this.history.length -1 ?
        this.history.length - 1 : (this.currentIndex = this.currentIndex + 1);
        location.hash = this.history[this.currentIndex];
        this.routes[this.history[this.currentIndex]]();    
    }
}

const Router = new HasRoute()
const content = document.querySelector('body');
const backButton = document.getElementById('back-button');
const button = document.getElementById('go-button');
function changeBgColor(color) {
  content.style.backgroundColor = color;
}
Router.setRoute('/', function () {
    changeBgColor('yellow')
})
Router.setRoute('/blue', function() {
    changeBgColor('blue');
});
Router.setRoute('/green', function() {
    changeBgColor('green');
});
backButton.addEventListener('click', Router.backOff, false);
button.addEventListener('click', Router.go, false);