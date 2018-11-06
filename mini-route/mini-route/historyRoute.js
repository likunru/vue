// 注意： pushstate涉及到跨域的问题，因此把项目放到本地node上面跑
class HistoryRoute {
    constructor () {
        this.routes = {};
        // 初始话监听popState
        this._bindPopState();
    }
    // 初始化路由
    init (path) {
        history.replaceState({path: path}, null, path);
        this.routes[path] && this.routes[path]();
    }
    route (path, callback) { 
        this.routes[path] = callback;
    }
    // 触发路由对应的回掉
    go (path) {
      history.pushState({path: path}, null, path);
      this.routes[path] && this.routes[path]();
    }
    // 监听popstate事件
    _bindPopState () {
        window.addEventListener('popstate', e => {
            const path = e.state && (e.state.path).substr(1);
            this.routes[path] && this.routes[path]();
        })
    }
}

window.Router = new HistoryRoute();
Router.init(location.pathname);
const content = document.querySelector('body');
const ul = document.querySelector('ul');
function changeBgColor(color) {
  content.style.backgroundColor = color;
}

Router.route('/', function() {
  changeBgColor('yellow');
});
Router.route('/blue', function() {
  changeBgColor('blue');
});
Router.route('/green', function() {
  changeBgColor('green');
});

ul.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    Router.go(e.target.getAttribute('href'));
  }
});