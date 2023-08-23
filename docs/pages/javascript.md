# Javascript

## 基础

### Reflect

- Reflect 暴露语言内部方法
  ```js
  // 老写法
  Function.prototype.apply.call(Math.floor, undefined, [1.75]); // 1
  // 新写法
  Reflect.apply(Math.floor, undefined, [1.75]); // 1
  ```
- 未定义属性，不报错，返回 false
- 让 Object 命令式操作变为函数行为
  ```js
  // 老写法
  "assign" in Object; // true
  // 新写法
  Reflect.has(Object, "assign"); // true
  ```
- 保留 Proxy 的所有默认行为

  ```js
  Proxy(target, {
    set: function (target, name, value, receiver) {
      var success = Reflect.set(target, name, value, receiver);
      if (success) {
        console.log("property " + name + " on " + target + " set to " + value);
      }
      return success;
    },
  });
  ```

-

### script 标签

六属性：async(异步脚本) defer(延迟脚本) src type(MIME 类型) crossorigin  
nomodule：true 表示这个脚本在支持 ES2015 modules 的浏览器中不执行，用来为不支持 es6 浏览器提供回退版本。  
crossorigin：使那些将静态资源放在另外一个域名的站点打印错误信息

#### defer 和 async

同：都不会阻塞页面的渲染
defer：通知浏览器该脚本将在文档完成解析,DOM 构建完成后后，触发 DOMContentLoaded 事件前执行。有 defer 属性的脚本会阻止 DOMContentLoaded 事件，直到脚本被加载并且解析完成。
async：浏览器不会因 async 脚本而阻塞，脚本在文档中的顺序不重要 —— 先加载完成的先执行。

### 模块化规范

#### **CJS**

1. 同步加载模块，运行时加载
2. 每个 js 文件是一个模块，每个模块内部都有一个 module 变量，代表当前模块。 module.exports

```js
let num = 1;
function add(x) {
  return num + x;
}
exports.num = num; //exports即 module.exports;
module.exports.add = add;
```

3. 加载某一个模块，就是加载这个模块的 module.exports 属性 ,require 的基本功能是读取并执行 JS 文件，如果模块导出的是一个函数，就不能定义在 exports 对象上。  
   require 加载时，会执行模块中的代码，然后将模块的 module.exports 属性作为返回值进行返回。  
   require 属性：

- resolve：需要解析的模块路径。
- main：Module 对象，表示当进程启动时加载的入口脚本。
- extensions：如何处理文件扩展名。
- cache：被引入的模块将被缓存在这个对象中。  
  当我们在一个项目中多次 require 同一个模块时，CommonJS 并不会多次执行该模块文件；  
  而是在第一次加载时，将模块缓存；  
  以后再加载该模块时，就直接从缓存中读取该模块.可以通过`delete require.cache[modulePath]`将缓存的模块删除。

```js
require ={
  ...,
  cache:{
    'D:\\demo\\main.js': Module {},
    'D:\\demo\\number.js': Module {}
}
}
```

#### **EJS**

import 编译时加载，会优先执行（变量提升），是引用，是只读引用。也有缓存。

#### **区别**

通过上面我们对 CommonJS 规范和 ES6 规范的比较，我们总结一下两者的区别：

- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
- CommonJS 模块输出的是一个值的复制，ES6 模块输出的是值的引用
- CommonJS 加载的是整个模块，即将所有的方法全部加载进来，ES6 可以单独加载其中的某个方法
- CommonJS 中 this 指向当前模块 module.exports，ES6 中 this 指向 undefined
- CommonJS 默认非严格模式，ES6 的模块自动采用严格模式

#### **UMD**

兼容 CJS 和 EJS 的处理，判断支持哪种类型直接应用。

### 错误类型

1. SyntaxError: 语法错误
2. ReferenceError: 引用错误 要用的东西没找到
3. RangeError: 范围错误 专指参数超范围
4. TypeError: 类型错误 错误的调用了对象的方法
5. EvalError: eval()方法错误的使用
6. URIError: url 地址错误

### 原型链

为什么要有原型链？  
JavaScript 采用原型编程，所有对象都能共享原型上的方法，节省内存;
同时基于原型这一实现思想，JavaScript 通过找对原型链，方便地实现了继承。

### 基本类型

typeof 判断基础数据类型  
Object.prototype.toString 判断某个对象属于哪种内置类型
instanceOf 检测 constructor.prototype 是否存在于参数 object 的原型链上。

```js
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(“abc”);// "[object String]"
Object.prototype.toString.call(123);// "[object Number]"
Object.prototype.toString.call(true);// "[object Boolean]"

function typeOf(obj) {
return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
typeOf([])        // 'array'
typeOf({})        // 'object'
typeOf(new Date)  // 'date'

```

### 装箱拆箱

#### 装箱

将基本数据类型转换为对应的引用类型。  
隐式装箱：

```js
var s1 = "hello"; //隐式装箱
var s2 = s1.substring(2);

// 执行过程：
// 1. 创建String类型的一个实例；  var s1 = new String('call_me_R');
// 2. 在实例中调用substring方法  var s2 = s1.substring(2);
// 3. 销毁该实例  s1 = null;
```

显示装箱：
通过基本包装类型对象对基本类型进行显示装箱。

```js
var objStr = new String("call_me_R");
objStr.job = "frontend engineer";
objStr.sayHi = function () {
  console.log("hello kitty");
};
console.log(objStr.job); // frontend engineer
objStr.sayHi(); // hello kitty
// 在执行流离开当前作用域之前一直保留在内存中
```

#### 拆箱

拆箱是指把引用类型转换成基本的数据类型。通常通过引用类型的 valueOf()和 toString()方法来实现。  
valueOf 和 toString 返回值的区别：
valueOf 按值的类型返回值；
toString 按 string 类型返回值。

<!-- ### 闭包

闭包的应用场景？
curry 函数，防抖节流，compose 函数 -->

## ES6+

- at
  获取数组的倒数项 arr.at(-1)
- Object.hasOwn()
  自身是否有该属性。 obj.hasOwnProperty 缺点：可被覆盖；Object.create(null)创建的对象无该方法。
- 数组后序查找
  findLast，findLastIndex

### 箭头函数

```js
const fn = () => {};
fn.__proto__ === Function.prototype; //true
fn.prototype === undefined; //true，因此不能作为构造函数
```

箭头函数不会创建自己的 this，它只会从自己的作用域链的上一层继承 this；通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定 this），他们的第一个参数会被忽略。

### 小数处理

- 四舍五入
  .toFixed()  
  Math.round()
- 不四舍五入
  ~~ 将后面的字符转换成 Int 类型

```js
~~"1.51"; // 1
```

### 可选链

?. 短路返回值是 undefined

```js
obj?.prop;
obj?.[expr];
arr?.[index];
func?.(args);
```

### ||和??

?? 前面是 null、undefined 取后面的

|| 前面值转成布尔类型是 false 取后面的

### for … of

遍历可迭代对象的值（Array，Map，Set，String，TypedArray，arguments，dom 集合，[生成器](#生成器)等），可以由 break，throw，continue 或 return 终止

可迭代对象：该对象（或者它原型链上的某个对象）必须有一个键为 @@iterator 的属性(@@表示 Symbol)，可通过常量 Symbol.iterator 访问该属性

```js
const str = "str";
str[Symbol.iterator](); // 返回Iterator 对象
const obj = {};
console.log(obj[Symbol.iterator]); //undefined
```

### for … in

遍历对象的所有除 Symbol 以外的可枚举属性的 key，包括继承的可枚举属性

```js
// 仅遍历自有属性
const obj = {};
for (var prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(`obj.${prop} = ${obj[prop]}`);
  }
}
```

### Promise

#### 用法

```js
Promise.reject("error")
  .then(
    () => {
      console.log("success1");
    },
    () => {
      console.log("error1");
    }
  )
  .then(
    () => {
      console.log("success2");
    },
    () => {
      console.log("error2");
    }
  );

// 结果：
// error1
// success2

Promise.reject("error")
  .then(() => {
    console.log("success1");
  })
  .catch((err) => {
    console.log(err);
  })
  .then(
    () => {
      console.log("success2");
    },
    () => {
      console.log("error2");
    }
  );

// 结果：
// error
// success2
```

<!-- #### 手写 promise -->

## 数据处理

初始化数组

```js
new Array(3)   //[empty*3]
new Array(3).fill('')   //['','','']
new Array(1，2)   //[1，2]
```

[empty*3] 稀疏数组，有预留长度为 3，但实际是空的，无法遍历

数组去除空值

```js
const arr = [1, 2, 0, undefined, 11, "12", null];
console.log(arr.filter((i) => i)); //  [1, 2, 11, '12']
```

数组去重 ES5

```js
function unique(arr) {
  var res = arr.filter(function (item, index, array) {
    return array.indexOf(item) === index;
  });
  return res;
}
```

对象数组根据某一属性去重

```js
let amap = new Map();
data = data.filter((a) => !amap.has(a.value) && amap.set(a.value, 1));
```

<!--
## 应用场景
### postMessage
1. chrome插件，通讯
2. 同一域名页面之间通讯 -->
