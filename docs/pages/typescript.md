<!--
 * @Author: your name
 * @Date: 2022-02-21 09:49:33
 * @LastEditTime: 2022-02-23 17:25:24
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /blog/docs/pages/typescript.md
-->

## Typescript

#### keyof

该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```js
function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]
}

interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string | number
```

#### Required & Partial & Pick

partial: 提取部分  
pick: 按 key 提取

```js
interface User {
  id: number;
  age: number;
  name: string;
}

// 相当于: type PartialUser = { id?: number; age?: number; name?: string; }
type PartialUser = Partial<User>;

// 相当于: type PickUser = { id: number; age: number; }
type PickUser = Pick<User, "id" | "age">;
```

#### 分情况讨论

```js
type isTrue<T> = T extends true ? true : false

// 相当于 type t = false
type t = isTrue<number>

// 相当于 type t = false
type t = isTrue<false>
```

<!-- http://shanyue.tech/post/ts-tips.html#_06-is -->

#### React 相关

```js
const [state,setState]=useState<typeof initial>(initial)
setState: React.Dispatch<React.SetStateAction<null>>;
```

#### infer
通过模式匹配获取特定部分的类型
```ts
type Last<Arr extends unknown[]> = Arr extends [...infer rest, infer Ele]
  ? Ele
  : never;

type res = Last<[1, 2, 3]>;
//type res =3
```

```ts
type GetReturnType<Func extends Function> = Func extends (
  ...args: any[]
) => infer ReturnType
  ? ReturnType
  : never;
```
TS 4.7 引入 infer extends 约束推导的类型  


