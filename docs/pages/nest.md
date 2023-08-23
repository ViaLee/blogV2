# Nest

MVC+IOC，提供 Express、Fastify 底层 Api,只需在初始化容器时指定使用哪种模式，typeORM 操作数据库

## MVC 模式

module 是逻辑上的模块，controller(结构定义路由)处理请求分配给 service，service 为 controller 服务，是 provider。

- controller 通过 @controller 声明
  只有在 module 中被引入的 controller,才真正被注册，创建类实例
- service 通过 @Injectable 声明

## IOC(Inverse Of Control) 控制反转依赖注入

所有 module 由 IOC 容器管理。使得逻辑解耦。  
`typeORM` 也作为一个 Module，由`@nestjs/typeorm` 提供，`TypeOrmModule.forRoot` 创建数据库连接，`TypeOrmModule.forFeature` 创建不同实体类对应的操作类 respository，供其他 module 引入。

```js
// note.module
import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}


// note.service
// dto: data transfer object
import {Respository} from 'typeorm';
import { Note } from "./entities/note.entity";
import { InjectRespository } from "@nestjs/typeorm";

@Injectable()
export class NotesService{
  constructor(
    @InjectRespository(Note)
    private noteRespository:Respository<Note>
  ){}

async create(createNoteDto: CreateNoteDto){
  createNoteDto.createTime = createNoteDto.updateTime = new Date();
  createNoteDto.isDelete = false
  return await this.noteRespository.save()
}


}
```

## TypeORM

### 实体

定义一个类，类似 interface，指定字段类型。  
用@Entity 修饰这个类，将根据该类，生成一个表实例，使用@Column 修饰字段，将作为表的列，其类型将根据你定义的字段类型自动推断：

- number 将被转换为 integer
- string 将转换为 varchar
- boolean 转换为 bool

#### 特殊列

@UpdateDateColumn、@VersionColumn，调用 save()时会自动更新，@CreateDateColumn，插入时自动设置

#### 设置列类型

```js
@Column("int")  or  @Column({type:'int'})
@Column("varchar", { length: 200 }) or @Column({ type: "int", length: 200 })
```

### 嵌入式实体: 把公共列抽离到一个类

```js
// Name
import { Entity, Column } from "typeorm";

export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

// 实体中引入Name的列
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Name } from "./Name";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column((type) => Name)
  name: Name;

  @Column()
  isActive: boolean;
}

// 最终的表：
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| nameFirst   | varchar(255) |                            |
| nameLast    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

### 表继承

避免重复列，类似嵌入式实体？列最终相互独立在实体中

```js
// 抽象基类
export abstract class Content {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

}


// 实体
@Entity()
export class Photo extends Content {

    @Column()
    size: string;

}

```

单表继承：Photo、Question 实体的实例都保存在 content 表中

```js
// 创建 content 这张表
@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}

// 实体（子实体）Photo
@ChildEntity()
export class Photo extends Content {
  @Column()
  size: string;
}
// 实体（子实体）Question
@ChildEntity()
export class Question extends Content {
  @Column()
  answersCount: number;
}
```

## SQL 语句

### 去重

SELECT DISTINCT m_id FROM table;

### 排序

多列排序  
SELECT m_id,salary FROM table ORDER BY salary ASC(升) DESC (降序),m_id ASC

### 条件查询

- WHERE a = 1;
- 且 AND 或 OR 非 NOT
- 不等于 <> !=
- 区间判断 salary BETWEEN 1000 小 AND 2000 大
- 空值 m_id IS NULL; m_id IS NOT NULL;
- 枚举查询 WHERE m\*id IN(12,32,43);
- 模糊查询 LIKE a\_\_; LIKE a%; (\*单个任意字符，%任意个任意字符)
- 正则查询 WHERE id REGEXP '^aaa'
- SELECT m_id,salary
  CASE
  WHEN salary = 1000 THEN 'A'
  WHEN salary = 700 THEN 'B'
  WHEN salary = 500 THEN 'C'
  ELSE 'D'
  END as 'LEVEL'
  FROM table

### 字符串查询

SELECT CONCAT(first_name,last_name) AS '姓名' from 'table';  
SELECT INSERT('这是一个数据库',3,2,'MYSQL'); (index 从 1 开始)  
SELECT LOWER('MYSQL');  
SELECT UPPER('mysql')
SELECT SUBSTRING('mysql',1,2)从一开始截两个

### 聚合函数

SUM AVG MAX MIN COUNT(忽略 null)

### 分组查询

各部门的平均工资  
SELECT d_id,AVG(salary) FROM table GROUP BY d_id;  
各部门、各岗位的人数  
SELECT d_id,j_id,COUNT(e_id) FROM table GROUP BY d_id,j_id;

> 分组查询中，只能 select 分组依据列，或聚合函数列

**过滤：**  
先分组后过滤  
GROUP BY id HAVING  
统计 20、70、90 号部门的最高工资：

1. 分组
2. 过滤出这些号
3. max

```sql
SELECT d_id,MAX(salary)
FROM table
GROUP BY d_id
HAVING d_id IN(20,70,90);
```

### 限定查询

前五条  
SELECT \* FROM table LIMIT 0,5;

### 子查询

单行单列结果  
WHERE salary > (SELECT salary FROM table WHERE id=60);  
多行单列结果  
WHERE salary > ALL(SELECT salary FROM table WHERE d_id=60);  
WHERE salary > ANY(SELECT salary FROM table WHERE d_id=60);  
多行多列结果(表) 工资排名前五的

```sql
SELECT e_id,first_name,salary FROM
(SELECT e_id,first_name,salary FROM table ORDER BY salary DESC) AS temp
LIMIT 0,5;
```

### 合并查询

- 合并两张表的结果并去重  
  以第一个结果表的列名为基础，添加第二张表的数据。**列数必须相同，数据类型可不同**

```sql
SELECT * FROM t1 UNION SELECT * FROM t2
```

- 合并两张表的结果

```sql
SELECT * FROM t1 UNION ALL SELECT * FROM t2
```

### 表连接查询

- 内连接查询

```sql
SELECT t1.key FROM t1
INNER JOIN t2
ON t1.id = t2.id
```

- 左外连接
  以左表为主表，依次向右匹配，匹配不到，以 NULL 填充
- 右外连接
  以右表为主表，依次向左匹配，匹配不到，以 NULL 填充

### DML 操作

- 新增
  INSERT INTO t1(id,key,val) VALUES(1,1,'值')
- 修改
  UPDATE table1 SET key=200,salary = 2000 WHERE id = 100;
- 删除
  单条数据  
  DELETE FROM table1 WHERE id = 100;  
  整表清空 (销毁原表，建新表)
  TRUNCATE TABLE table1

### 列操作

- 添加
  ```sql
  ALTER TABLE `subject` ADD gradeId INT;
  ```
- 修改类型或约束
  ```sql
  ALTER TABLE `subject` MODIFY name VARCHAR(10);
  ```
- 修改列名 改为 name2,要定义类型和约束
  ```sql
  ALTER TABLE `subject` CHANGE name1 name2 VARCHAR(10);
  ```
- 修改表名
  ```sql
  ALTER TABLE `subject` RENAME `sub`;
  ```
- 删除列
  ```sql
  ALTER TABLE `subject` DROP 列;
  ```
- 删除唯一约束
  ```sql
  ALTER TABLE `subject` DROP INDEX 列;
  ```
- 删除表
  ```sql
  DROP TABLE `sub`;
  ```

### 实体完整性约束

- 主键约束
  name 不可重复，且不能为 NULL  
  name VARCHAR(10) PRIMARY KEY
- 唯一约束
  行不可重复，可为 NULL
- 自动增长列
  配合主键使用  
  id INT PRIMARY KEY AUTO_INCREAMENT

## TypeORM(Object Relational Mapping)

类-实体-表
