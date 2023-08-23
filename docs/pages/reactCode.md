# React

设计理念：快速响应  
制约因素：CPU、IO  
节流防抖：限制触发更新频率  
React 通过异步可中断更新解决 CPU 瓶颈；  
将人机交互的成果融入 UI 交互，使异步无感知。

## useEffect

Commit 阶段：

- beforeMutation
  检测到 useEffect,调度 flushPassiveEffects
- mutation
- layout
  注册 destroy、create 到 flushPassiveEffects 上
- commit 完成后
  执行 flushPassiveEffects，判断是否为 mount 阶段，即 current 是否为 null，如果为 null，则不会执行 destroy

对于页面刷新、关闭、跳转相当于实例销毁，于 useEffect 无关。  
useEffect 是异步执行，因为从检测到实际执行经历了多个阶段，原因是：防止同步执行阻塞浏览器渲染。  
useLayoutEffect 则是在 mutation 阶段执行 destroy 回调，在 layout 阶段同步执行。

## react 启动模式

- legacy 模式：` ReactDOM.render(<App />, rootNode)`。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
- blocking 模式： `ReactDOM.createBlockingRoot(rootNode).render(<App />)`。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
- concurrent 模式： `ReactDOM.createRoot(rootNode).render(<App />)`。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了所有的新功能。

## 完整流程

### 触发更新

ReactDom.render,classcomponent,fncomponent

### 调度

### render 阶段

采用深度优先遍历，递归的方式遍历  
递阶段：
遍历每个节点的 fiber 调用 beginWork 方法
mount:

- 根据 fiber.tag 创建当前 fiber 节点的第一个子 fiber 节点
- 标记 effectTag

update:

- 满足一定条件时克隆 current.child 作为 workInProgress.child
- diff
- 创建 fiber 初始化 dom 属性

**当遍历到叶子节点时就会进入到归阶段**
归阶段：completeWork

### commit 阶段

## hooks 闭包缺陷

与 classComponents 不同，不是用`this.`获取 state 的值，而是直接获取，这样在类似 setTimeout 的函数中读取的值不是最新值。  
 functionComponents 中使用 hooks 存储、更新状态，内部也是通过闭包获取状态值，每次更新都会生成一个新的闭包。  
 闭包缺陷分为两种：

- useState 的 setState 可能取不到最新值
  避免方法：使用回调方式更新值
- useEffect 中在 setTimeout 中读取 state，取不到最新值
  避免方法：：添加依赖，每次渲染都更新读取的这个 state

## setState 同步异步

### reactV15

- 根据 `excutionContext` 有值(Y 异 N 同)，在一个上下文中同时触发多次更新，这些更新会合并成一次更新
- 根据 `isBatchingUpdates` true(Y 异 N 同)

同步更新/不合并：原生事件、异步代码
异步更新/合并：React 合成事件、生命周期钩子、在原生事件和异步代码中使用`ReactDOM.unstable_batchedUpdates`

### reactV16.8

## 时间切片

FPS(frame per second) 每秒显示帧数  
浏览器一帧干了些啥  
![fps](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13528958b6804c16a1dafb613d24b8a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### requestFrameAnimation

#### 基本用法

```js
let fn = () => {};
let count = 0;
function animation() {
  if (count > 200) return;

  dom.style.marginLeft = `${count}px`;
  count++;
}
Window.requestAnimationFrame(fn);
Window.cancelAnimationFrame(fn);
```

> 每一帧只会调用一次 rAF

#### 兼容性

理论上不能使用 setTimeout 兜底：  
当执行完 setTimeout 回调后，浏览器发现还有时间，于是又执行了几次 setTimeout 回调，最后再一起渲染，所以在原本一帧的时间内执行了多次 setTimeout 回调，动画自然就会快很多。且 setTimeout 有最低 4ms 延时。

### requestIdleCallback

```js
const callback=(deadline)=>{
  console.log(deadline.didTimeout) //是否在超时前已完成
  console.log(deadline.timeRemaining()) //本次空闲周期内剩余时间
}
var handle = window.requestIdleCallback(callback[, options])
Window.cancelIdleCallback(handle)  //取消
```

- requestIdleCallback 每秒只会被执行 20 次，一个空闲周期最长 50ms
- 低优先级的任务适用

### web 通信

都属于宏任务

1. 跨文档通信 PostMessage，方法可以安全地实现跨源通信。
2. 通道通信 MessageChannel

```js
var channel = new MessageChannel();
channel.port1.onmessage = (e) => {
  console.log(e.data);
};
channel.port2.postMessage("Hello World");
```

### react v16.0.0 rAF + postMessage

1. 获取当前帧最晚结束时间（当前执行时间 + 33ms）
2. postmessage 推入一个任务（完成其他任务之后）  
   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;↓
3. 执行 messageListenr 回调, 获取当前帧剩余时间
4. 将剩余时间传入到 rAF 的 callback 函数中

> requestAnimationFrame() 会被暂停调用以提升性能和电池寿命，会影响 react 执行。

### react v16.2.0+ MessageChannel

flushWork 返回是否还有未完成的任务，如果有则会进行下一次 PostMessage，让出线程，告诉浏览器执行完高优任务后继续执行，进入下一个切片

```js
function flushWork(hasTimeRemaining, initialTime) {
  return workLoop(hasTimeRemaining, initialTime);
}

var currentTask;

function workLoop(hasTimeRemaining, initialTime) {
  currentTask = taskQueue[0];
  // 1.从任务队列第一个开始遍历执行
  while (currentTask != null) {
    // 2.已无剩余时间或主动交还执行权则跳出遍历
    if (
      currentTask.expirationTime > initialTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      break;
    }
    // 3.执行回调、从任务队列移除该任务
    const callback = currentTask.callback;
    callback();

    taskQueue.shift();

    currentTask = taskQueue[0];
  }
  // 4. 返回是否还有未完成的任务
  if (currentTask !== null) {
    return true;
  } else {
    return false;
  }
}

// 默认的时间切片
const frameInterval = 5;
// 5. 如果当前时间 - 开始时间，即执行时间，大于时间切片预设时间则主动中断
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    return false;
  }

  return true;
}
```

## render 阶段

### diff

限制：

1. 同级
2. 同种元素
3. 可通过设置 key 打破限制 2

diff 分两种情况：

1. 单一节点 判断 key 是否一致、判断是否为同种元素 &emsp;--是--> 根据 currentfiber clone createFiber
   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ↓ 否  
   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; 标记删除 dom,创建 newfiber
2. 多节点
   对比更新前后的 nodeList,为 node 标记 flag,需要考虑是以下三种情况的哪种情况：

- 节点属性变化
- 节点增删
- 节点位置移动  
  三种情况的处理逻辑不同，1 情况更常见。  
  经历两轮遍历，首轮优先处理常见情况 1，第二轮后其他情况。

```js
// 虚拟dom节点数据结构
type flag = "Placement" | "Deletion"; //Placement新增或移动，Deletion删除
interface Node {
  key: string; //node的唯一标识
  flag?: Flag; // 标记操作类型
  index?: number; //该node在同级node中的索引位置
}

type NodeList = Node[];
function diff(before: NodeList, after: NodeList): NodeList {
  const result:NodeList = [];
  // 遍历前准备工作
  // 1.需要存一份beforeNode,且以O(1)复杂度就能找到对应的node
  const beforeMap = new Map<string,Node>();
  before.forEach((node,i)=>{
    node.index=i;
    beforeMap.set(node.key,node));
  });
    // 2.遍历after,对比before，after，都存在的node，可复用，将存在两种情况：移动、不移动，如何判断？
  for(let i=0;i<after.length;i++>){
    // 遍历逻辑
  }

  return result;
}
```

demo1:

```js
// 更新前
const before = [{ key: "a" }];

// 更新后
const after = [{ key: "d" }];

console.log(diff(before, after));
/*
[
  {key:'a',flag:"Deletion"},
  {key:'d',flag:"Placement"}
]
*/
```

demo2:

```js
// 更新前
const before = [
  {key: 'a'},
  {key: 'b'},
  {key: 'c'},
]
// 更新后
const after = [
  {key: 'c'},
  {key: 'b'},
  {key: 'a'}
]

diff(before, after) 输出
/*
[
  {key: "b", flag: "Placement"},
  {key: "a", flag: "Placement"}
]

由于b之前已经存在，{key: "b", flag: "Placement"}代表b对应DOM需要向后移动（对应parentNode.appendChild方法）。abc经过该操作后变为acb。

由于a之前已经存在，{key: "a", flag: "Placement"}代表a对应DOM需要向后移动。acb经过该操作后变为cba。

执行后的结果就是：页面中的abc变为cba。
*/
```

### update 计算

### 优先级调度

## commit 阶段
