# 2021/11~2022/01

## miHoYo

1. [HTTP 缓存](/pages/http.html#HTTP缓存)
2. [协商缓存为什么需要根据 etag 和 Last-Modified**两个**字段判断?](/pages/http.html#为什么要有etag)
3. [事件循环机制](/pages/browser.html#事件循环)
4. [Webpack 里 tree shaking 怎样开启](/pages/webpack.html#tree-shaking)
5. 闭包的应用场景，它的缺陷， hooks 怎样处理缺陷？
6. Bfc，盒子模型，画一个三角形
7. 怎样写一个旋转刷新的动画 CSS3
8. [重绘，回流，怎样优化](/pages/browser.html#渲染)
9. [JS 数据类型有哪些，怎样检测](/pages/javascript.html#判断类型)
10. [script 标签设置 defer 和 async 的区别](/pages/javascript.html#script-标签)
11. [垃圾回收机制](/pages/browser.html#垃圾回收机制)
12. 事件委托在 React，Vue 里是怎样的
13. 自定义 hooks 的特点
14. 怎样实现一个自定义 hook：检测一个 dom 元素内容是否溢出，返回布尔类型
15. useCallback
16. Context，子组件怎样修改公共 state，底层是怎样实现的
17. React 里的虚拟 dom
18. diff 算法具体说说
19. Fiber 是什么，它是怎样实现分片处理的，怎样实现暂停的
20. 前端性能优化

## XTransfer

1. http1.1 和 http2.0 分别解决了什么问题  
   http1.1 一定时间内可复用连接，connection：keepalive；多连接,chrome 里同域名下最多同时建立 6 个连接，一个连接同时只能发送一个请求，且传输是按顺序的；明文传输；头部信息多，每次需重新发送。
   http2.0 单连接多路复用；gzip 压缩报文内容 body，以二进制分帧的形式乱序传输，在客户端重组；头部根据索引表传输(HPACK 算法压缩头部)
2. js 垃圾回收机制，两种的区别，优缺点
3. js 数据类型，字符串的 length 方法来自哪里
   [装箱拆箱](/pages/interview.html/#装箱拆箱)
4. 手写 curry 函数  
   fn.length 递归
5. this 分情况说明指向
6. [事件循环机制](/pages/browser.html#事件循环)
7. setState 是异步还是同步，批量更新优点
8. redux reducer 为什么要返回拷贝对象
9. react 单向数据流怎么理解，对比 vue
10. TCP 建立连接为什么要有第三次握手

## 掌门育儿乐

1. vw 和 vh?
   怎样实现一个撑满屏幕的正方形
2. flex 布局，grid 布局
3. bfc，怎样开启，能解决什么问题
   position 非 relative，display:inline-box,float,overflow:auto/hidden  
   解决外边距重叠；浮动元素父级塌陷
4. 盒模型
   标准盒模型 contentbox
   IE 盒模型 borderbox
5. [行内元素的间隔问题](https://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-%E5%8E%BB%E9%99%A4%E9%97%B4%E8%B7%9D/)
6. js 数据类型，怎么检测
7. axios 底层
8. promise 状态，链式调用怎么实现的
9. promise 怎样在中途某一个.then 里终止链式调用
   - return Promise.reject() // 报错
   - return new Promise(()=>{}) // 不报错
10. ajax 底层 用了 xhr 哪些 api
    xmlhttp.open("POST", url, false);
    xmlhttp.onreadystatechange=()=>{}; //完成的回调
    xmlhttp.send();  
    [更多](https://www.cnblogs.com/mingmingruyuedlut/archive/2011/10/18/2216553.html)
11. map 类型和 object 类型的区别（键类型，迭代器）
    map: 有序，键值类型任意，可迭代，以键值对的形式迭代
    object: 无序，键值类型 string，symbol，需要手动添加迭代器才可迭代

## 其他

### html

1.  b 和 strong 区别 标签语义化的意义

### css

1. css 画三角形
   不能通过宽高实现
2. display:'none'和 visbility:'hidden'区别  
   css display:'none'不会在渲染树中出现,不是继承属性; visbility:'hidden'其占的空间会被空白占位,是继承属性,父元素的 visibility 为 hidden 但是子元素的 visibility 为 visible 则子元素依旧可见，子元素 visibility 不存在则子元素不可见。
3. 选择器的优先级

### js

1. js 数据类型
2. 作用域类型有哪些
3. 怎样防止全局变量相互污染
4. 闭包是什么以及解决了什么问题
5. 异步和同步的区别，以及异步方案
   promise 和 async await
6. call，apply，bind 的区别，用法
7. class 可以多继承吗？
   静态方法和实例方法的区别
8. js 基本数据类型
   类型检测方法，三种
9. 原型链，原型查找顺序
10. js 浮点型数据准确度缺陷，怎样克服
11. es6 常用语法
    let 和 var 区别
12. promise 底层实现
13. 数组遍历方法哪些可以中断？ every,some
14. function 和 箭头函数的区别？
15. 举例说说 this？
16. 怎么获取 dom 的位置和尺寸？
17. clientWidth 和 offsetWidth 的区别？
18. new 发生了什么？
19. 为什么要用 constructor ？
20. 页面挂载完成的回调？
21. window.onload 和 document.onDOMContentLoaded 的区别？
22. 怎样下载后台接口返回的图片流？ new blob
23. 如何直接交换两个变量的值

```js
// 这都是什么神仙写法😭
// -----方法1-----
let a = 10,b = 20;
  [(a, b)] = [b, a];
// -----方法2-----
function swap(a, b) {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
}
console.log(swap(10, 20));
// -----方法三-----
let a = 10,b = 20;
a+=b-(b=a);
```

### 网络

1. http 个版本的区别/ http 发展史
2. get post 区别
   GET 请求在 URL 中传送的参数是有长度限制的，而 POST 没有
   post 请求体支持的数据类型

### react

1. react diff 算法
2. react 性能优化
3. react 生命周期
   getDerivedStateFromProps 静态方法纯函数
   错误钩子 getDerivedStateFromError(render 阶段),componentDidCatch(commit 阶段)
4. react15 和 16 的区别 fiber 的特点
5. useRef 和 createRef 的区别
   createRef 用于类组件，返回一个 ref 对象，会成为组件实例上的一个属性  
   useRef 用于函数组件，产生的 ref 对象挂到函数组件对应的 fiber 上
6. react 中的优化
   suspence, 懒加载

7. 在 setTimeout 中调用 hooks 的更新方法有什么问题
   取不到最新值
8. react hooks 的缺陷，闭包陷阱
   不能拿到最新的 state,解决方法：  
   1、函数式编程
   2、使用 useRef 保持引用
   3、使用 useEffect 但要记得卸载时清除副作用
9. 为什么 hooks 只能在顶层使用

### vue

1. proxy 和 object.defineProperty 区别
2. vue react 的区别
3. computed 和 watch 的区别
4. nextTick
5. provider，inject

### 浏览器

1. 浏览器存储，区别
   localStorage 怎样设置过期时间
2. 事件机制
   解释事件冒泡，事件捕获  
   怎样实现事件捕获？
3. 事件循环
4. 跨域怎么解决
5. url 从输入到页面显示的过程

### ts

1. ts 对比 js 有什么好处
   ts 编译型语言
2. type 和 interface 的区别
3. 怎样实现继承
4. 函数重载怎样实现

### 工程化

1. 前端发版流程
2. 你了解的 docker，jekins
3. webpack 常用的 loader，plugin
4. babel-loader 底层实现
5. umi 的缺点
6. treeshaking 怎样检测无用代码

<!-- <Vssue :title="$title" /> -->
