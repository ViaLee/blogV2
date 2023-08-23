# HTTP

## HTTP 缓存

### 强缓存

Response Header 设置 Cache-Control 和 Expires  
优先级：Cache-Control > Expires

#### Expires(HTTP1.0)：

缓存的到期时间，若请求时间小于该时间，则直接使用缓存结果。
使用时间比较缺点：若客户端与服务端的时间由于时区或其他原因不一致，则缓存直接失效

#### Cache-Control(HTTP1.1,目前浏览器)：

- public：所有内容都将被缓存（客户端和代理服务器都可缓存）
- private(默认)：所有内容仅客户端可缓存
- no-cache：客户端缓存内容，通过协商缓存来决定是否缓存
- no-store：不强制缓存，也不协商缓存
- max-age=xxx ：缓存内容将在本次请求 xxx 秒后失效，xxx 秒内强制缓存生效

#### 从 NetWork 中的 size 可查看缓存是否生效以及位置：

**from memory cache** 内存缓存  
特点：将编译解析后的文件（如：js 和图片）存在该进程的内存中，方便下次快速读取，进程关闭，内存清空。

**from disk cache** 硬盘缓存  
特点：需要对该缓存存放的硬盘文件进行 I/O 操作，然后重新解析内容（如：css），读取复杂，速度比内存缓存慢。

> 浏览器读取缓存的顺序：memory –> disk。

### 协商缓存

当强缓存失效或未设置时，进入协商缓存流程

1. 协商缓存生效，返回 304
1. 协商缓存失效，返回 200 和请求结果

控制协商缓存的字段分别有：  
Etag / If-None-Match 和 Last-Modified / If-Modified-Since  
优先级：Etag / If-None-Match > Last-Modified / If-Modified-Since

#### Last-Modified / If-Modified-Since

Last-Modified: response header 设置，表示：该资源文件在服务器最后被修改的时间。  
If-Modified-Since：request header 设置，上次请求响应中的 Last-Modified  
服务端将两者对比后决定返回 200 或 304

#### Etag / If-None-Match

Etag：资源文件的一个唯一标识(由服务器生成) response header 设置  
If-None-Match：上一个 Etag，request header 设置  
服务端将两者对比，一致则返回 304，不一致则返回 200，和新的资源

#### 为什么要有 etag？

你可能会觉得使用 last-modified 已经足以让浏览器知道本地的缓存副本是否足够新，为什么还需要 etag 呢？HTTP1.1 中 etag 的出现（也就是说，etag 是新增的，为了解决之前只有 If-Modified 的缺点）主要是为了解决几个 last-modified 比较难解决的问题：

1. 一些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新 get；

2. 某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说 1s 内修改了 N 次)，if-modified-since 能检查到的粒度是秒级的，这种修改无法判断(或者说 UNIX 记录 MTIME 只能精确到秒)；

3. 某些服务器不能精确的得到文件的最后修改时间。

## HTTP 协议

### 协议升级机制

由客户端发起，将一个**已建立**的**http1.1**连接升级成新的、不相容的连接，只能由 http1.1 升级到 http2 或 ws

> http2 不支持连接升级机制，不支持 101 状态码

#### 配置**Request Header**：

Connextion：Upgrade  
Upgrade: 协议/版本(如：websocket、http/2)  
若服务端同意升级本次连接，则返回 101，header 携带 Upgrade：协议  
upgrade-insecure-requests：1 表示支持升级机制

```js
// 将站点的所有url替换成https的url
// 非跳转(non-navigational)的不安全资源请求会自动升级到HTTPS
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

### TCP 协议

为什么是三次握手？  
在谢希仁著《计算机网络》第四版中讲“三次握手”的目的是“为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误”。  
《计算机网络》一书中讲“三次握手”的目的是为了解决“网络中存在延迟的重复分组”的问题。  
通信双方需要就某个问题达成一致。而要解决这个问题, 无论你在消息中包含什么信息, 三次通信是理论上建立可靠传输的最小值。  
如果两次就建立，会浪费server的资源。

> 参考：[彻底理解浏览器的缓存机制](https://juejin.cn/post/6844903593275817998)  
> 参考：[彻底弄懂强缓存与协商缓存](https://www.jianshu.com/p/9c95db596df5)
