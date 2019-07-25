# console-frontend-Template

## 项目背景
> ***

## 项目目标
> ***

## 项目需求
> ***

## 开发工具 IDE

使用 WebStorm 作为开发工具，[下载地址](https://www.jetbrains.com/webstorm/)

> WebStorm 集成众多有用的功能，不用费力去配置如 Sublime Text 这样的编辑器，虽然 WebStorm 略有耗内存，不要心疼！多余的留着不用
就是浪费。

## 依赖安装

建议使用 ``` yarn ``` 命令进行项目依赖安装。 关于 ``` yarn ``` 请查阅  [yarn 安装与使用](https://yarnpkg.com/zh-Hans/)

yarn 安装：
```
yarn install
```
npm 安装:
```
npm install
```

## 项目构建 & ESLint 校验 Build Commands

### 开发构建

yarn 方式构建：
```
yarn serve
```
npm 方式构建:
```
npm run serve
```

### 生产构建
yarn 方式构建：
```
yarn build
```
npm 方式构建:
```
npm run build
```

###  ESLint 校验
yarn 方式运行：
```
yarn lint
```
npm 方式构建:
```
npm run lint
```

###  ESLint 校验并自动修复
yarn 方式运行：
```
yarn lint-fix
```
npm 方式构建:
```
npm run lint-fix
```

## 目录结构

以下是安装了所有模式的项目的结构。

> 目录结构基于 ```vue-cli 3``` 生成。

  ``` bash
.
├── dist/                    # 生产版本代码，用于部署
├── node_modules/            # 项目依赖模块，由 yran 或 npm 安装。
├── public                   # 纯静态资源
├── src/
│   ├── assets/              # 动态资源（由 webpack 处理）
│   ├── components/          # 用于页面和布局的 .vue 组件
│   ├── layouts/             # 布局 .vue 文件
│   ├── libs/                # 库文件
│   ├── router/              # Vue 路由器
|   |   ├── middleware/      # Vue 路由器中间件
|   │   └── routes/          # Vuex 模块路由
│   ├── services/            # ajax 请求接口地址，数据中间处理
|   |   ├── api/             # 接口请求地址，所有接口地址在这里进行配置
|   │   └── convertors/      # 请求环境配置
|   |   ├── interceptors/    # 请求拦截处理
|   │   └── ajax.js          # 导出请求方法
|   |   ├── axios.js         # axios 库公共设置
|   |   ├── baseUrl.js       # baseUrl 设置环境变量
|   │   └── index.js         # ajax 请求导出：1、 request 异步请求函数；2、asyncRequest 同步请求
│   ├── store/               # Vuex Store，分模块
│   ├── utils/               # 工具类文件 （与业务无关）
│   ├── views/               # 页面 .vue 文件
│   ├── App.vue              # APP 的根 Vue 组件
│   └── main.js              # main.js
├── test/                    # 测试，单元测试、点对点测试
├── .browserslistrc          # 浏览器支持配置
├── .babel.config.js         # babel 配置
├── .editorconfig            # editor 配置
├── cypress.json             # (⊙﹏⊙) E2E 测试配置
├── Gitlab-Flow.md           # gitlab 工作流说明文档
├── .eslintignore            # ESlint 忽略路径
├── .eslintrc.js             # ESlint 配置
├── postcss.config.js        # PostCSS 配置
├── .stylintrc               # Stylus lint 配置
├── tsconfig.json            # TypeScript 配置
├── .gitignore               # GIT 忽略路径
├── package.json             # npm 脚本和依赖项
└── README.md                # 您的网站/应用程序的自述文件
```

## 开发规范及约定

> 功能开发、页面开发或组件开发时请务必遵循本项目开发流程及开发约定。否则可能导致编译或测试不通过等情况。
> 如认为有不妥之处，可以讨论并修正。
> 以下将详细解释本项目的开发约定规范及开发流程。

### 一、命名规范

> 最重要的一致性规则是命名管理. 命名的风格能让我们在不需要去查找类型声明的条件下快速地了解某个名字代表的含义: 类型, 变量, 函数, 常量, 宏, 等等, 甚至. 我们大脑中的模式匹配引擎非常依赖这些命名规则.
> 命名规则具有一定随意性, 但相比按个人喜好命名, 一致性更重要, 所以无论你认为它们是否重要, 规则总归是规则.

#### 1. 通用命名规范

> - 函数命名, 变量命名, 文件命名要有描述性; 少用缩写.

尽可能使用描述性的命名, 别心疼空间, 毕竟相比之下让代码易于新读者理解更重要.
不要用只有项目开发者能理解的缩写, 也不要通过砍掉几个字母来缩写单词.

**可接受的命名：**

``` javascript
priceCountReader      // 没有缩写.
numErrors             // “num” 是普遍的惯例。
numDnsConnections     // 大多数人知道“DNS”代表什么。
```

**不可接受的命名：**

``` javascript
n                     // 无意义的。
nErr                  // 模棱两可的缩写.
nCompConns            // 模棱两可的缩写.
wgcConnections        // 只有你的团队知道这代表什么.
pcReader              // 很多东西可以缩写为 “pc”.
cstmrId               // 删除单词内部字母.
kSecondsPerDay        // 使用非英文单词.
```

#### 2. 文件、文件夹命名

> - 文件或文件夹名要全部小写, 用连字符 `-` 分隔单词, `./src/components/` 目录下的组件文件除外。
> - `./src/components/`, `./src/views/` 目录下的组件文件（index.vue除外）和组件文件上一层文件夹, vue 入口文件,使用 `UpperCamelCase` 大驼峰命名组件文件以 `vue` 为后缀命名。

本项目约定使用连字符 - 对单词进行分割

**可接受的文件、文件夹命名：**

``` javascript
my-beautiful-girlfriend.jpg     // 图片文件。
store                           // 文件夹一个单词能表达意思，就不要画蛇添足。
module-example                  // 一个单词不能表达意思，用连字符 - 对单词进行分割。
HeaderBar.vue                   // ./src/components/ 目录下组件命名
index.vue                       // ./src/pages/ 目录下 vue 文件命名
```

#### 3、标识符命名
> 标识符指代码中用来标识变量、函数、类、方法或属性的字符序列。标识符与字符串不同之处在于字符串是数据，而标识符是代码的一部分。

##### 3.1 使用 `UpperCamelCase` 大驼峰命名的标识符：
- 类：`class`，包括 `Class`, `interface`, `record`, and `typedef`
- 枚举：`Enum`，一般应该是单数名词。

##### 3.2 使用 `lowerCamelCase` 小驼峰命名的标识符：
- 方法：`Method`
- 参数：`Parameter`
- 局部变量：`Local variable`
- 非常量字段：`Non-constant field`

##### 3.3 常量 `Constant` 命名：
- 常量：`Constant` 名称使用 `CONSTANT_CASE`：所有大写字母，单词之间用下划线 `_` 分隔。

每个常量都是 `@const` 静态属性或一个模块局部常量声明，但并非所有 `@const` 静态属性和模块局部常量都是常量。
在选择定义一个字段为常量之前，请考虑该字段是否真的是一个永恒不变的常量。
例如，如果一个实例的可观察状态是可以改变的，那么它几乎肯定不是一个常量。仅仅意图从不改变对象通常是不够的。

- 局部别名：`Local aliases`，别名命名视情况而定，重要的是能清楚描述被引用的对象所表达的含义。

通常别名命名只选取被引用的对象（类、函数、模块）其最后的方法名， 别名必须是 `const`。

**可接受的别名命名：**：
```
const MyClass = goog.require('some.package.MyClass');
const NsMyClass = goog.require('other.ns.MyClass');
const googAsserts = goog.require('goog.asserts');
const testingAsserts = goog.require('goog.testing.asserts');
const than80columns = goog.require('pretend.this.is.longer.than80columns');
const {clear, forEach, map} = goog.require('goog.array');
/** @suppress {extraRequire} Initializes MyFramework. */
goog.require('my.framework.initialization');
```

**不可接受的别名命名：**：
```
const randomName = goog.require('something.else'); // 名字必须匹配

const {clear, forEach, map} = // 不要断行
    goog.require('goog.array');

function someFunction() {
  const alias = goog.require('my.long.name.alias'); // 必须在顶部
  // …
}
goog.
```
##### 3.4 模板产生 `Template parameter` 命名：
- 模板参数名称应该是简洁，单字或单字母标识符，并且必须是全部大写字母，例如TYPE或THIS

### 二、源文件风格规范 - Source file style

> 源文件的编写风格我们使用 `xx-lint` 校验插件对相应代码进行代码风格及规范校验。

- 所有源文件使用 `UTF-8` 编码。
- 所有源文件使用`2个英文半角空格`缩进
- js 文件使用 `airbnb-base` 标准规范，使用 `Eslint` 进行检测，本项详细内容请查看 [Eslint/airbnb 标准规范](#eslintstandard)。
有关 `airbnb` 请查阅 [airbnb-base](https://github.com/airbnb/javascript)、[airbnb 中文](https://segmentfault.com/a/1190000013040555)
- css 文件使用 postcss 工具进行处理，因此可以配置符合项目的样式文件编写规范，本项详细内容请查看 [Postcss](#postcss)。
有关 `postcss` 请查阅 [postcss](https://www.ibm.com/developerworks/cn/web/1604-postcss-css/index.html)
- vue 文件使用 `eslint-plugin-vue` 进行处理，可以直接处理 vue 文件并检查模板里的语法错误，
有关 `eslint-plugin-vue` 请查看 [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)
- 使用 ES6 语法及特性编写 JavaScript 代码

### 三、Eslint 和 airbnb 标准规范 <span id='eslintstandard'></span>

>  `Eslint` 是 JavaScript 中目前比较流行的插件化的静态代码检测工具，通过使用它可以保证高质量的代码，尽量减少和提早发现一些错误。
使用eslint可以在工程中保证一致的代码风格，特别是当工程变得越来越大、越来越多的人参与进来时，需要加强一些最佳实践。

> `airbnb` 是 `Eslint` 如何对代码进行检测的规范标准，在 `Eslint` 的配置文件 `./.eslintrc.js` 中进行配置。

本项目在遵循 `airbnb` JavaScript 标准的基础上做适当调整，完整的 `Eslint` `规则配置`列表查看[Eslint 规则配置](https://github.com/AlloyTeam/eslint-config-alloy/blob/master/index.js). 调整规则如下：

> 之定义规则配置请查看 `./.eslintrc.js` 文件 `rules` 配置项。

`Eslint` 规则在开发过程中会根据实际情况做出调整。

### 四、代码注释规范
> 好的注释可以提高代码的可读性和可维护性，从而提高代码质量。

#### 4.1 目的与原则
> 我们写注释，是为了给代码的读者（包括我们自己，也可能包括机器，如 jsdoc）看，
帮助读者阅读理解代码并进行维护。

#### 目的：
- 提高代码的可读性，从而提高代码的可维护性。

#### 原则：
- 如无必要，勿增注释 ( As short as possible )
- 如有必要，尽量详尽 ( As long as necessary )

#### 4.2 注释规范
> 理解注释的目的和原则，制定并遵循一份注释规约，以保证注释的可读性和一致性
- 单行注释使用 `//`
- 多行注释使用 /** ... */, 而不是多行的 //
- 注释内容和注释符之间需要有一个空格，以增加可读性。
- 使用特殊注释标记.
- 文档类注释.

#### 4.2.1 单行注释使用 `//`

注释应单独一行写在被注释对象的上方，不要追加在某条语句的后面：
```
// bad
const active = true; // is current tab

// good
// is current tab
const active = true;
```

注释行的上方需要有一个空行（除非注释行上方是一个块的顶部），以增加可读性：
```
// bad
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this.type || 'no type';
  return type;
}

// good
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this.type || 'no type';
  return type;
}

// good
// 注释行上面是一个块的顶部时不需要空行
function getType() {
  // set the default type to 'no type'
  const type = this.type || 'no type';
  return type;
}
```

#### 4.2.2 多行注释使用 /** ... */, 而不是多行的 //
```
// bad
// make() returns a new element
// based on the passed in tag name
function make(tag) {
  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {
  // ...

  return element;
}
```

#### 4.2.3 注释内容和注释符之间需要有一个空格，以增加可读性。
``` javascript
// bad
//is current tab
const active = true;

// good
// is current tab
const active = true;

// bad
/**
 *make() returns a new element
 *based on the passed-in tag name
 */
function make(tag) {
  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {
  // ...

  return element;
}
```

#### 4.2.4 使用特殊注释标记.
> 有时我们发现某个可能的 bug，但因为一些原因还没法修复；或者某个地方还有一些待完成的功能，这时我们需要使用相应的特殊标记注释来告知
未来的自己或合作者。

常用的特殊标记有两种：

- // FIXME: 说明问题是什么
- // TODO: 说明还要做什么或者问题的解决方案

```
class Calculator extends Abacus {
  constructor() {
	super();

	// FIXME: shouldn’t use a global here
	total = 0;

	// TODO: total should be configurable by an options param
	this.total = 0;
  }
}
```

#### 4.2.5 文档类注释.
> 如函数、类、文件、事件等，使用 jsdoc 规范。例如：

```
/**
 * Book类，代表一个书本.
 * @constructor
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 */
function Book(title, author) {
  this.title=title;
  this.author=author;
}

Book.prototype={
  /**
   * 获取书本的标题
   * @returns {string|*}
   */
  getTitle:function(){
	  return this.title;
  },

  /**
   * 设置书本的页数
   * @param pageNum {number} 页数
   */
  setPageNum:function(pageNum){
	  this.pageNum=pageNum;
  }
};
```

### 五、Postcss and Css <span id='postcss'></span>

> Postcss： `A tool for transforming CSS with JavaScript`. 其规则配置在项目 `./.postcssrc.js` 配置文件中。

Quasar 框架在构建时默认使用 `cssnano` 进行优化，除此之外本项目还使用如下 `postcss-salad` 插件进行处理样式文件，以便能够轻松写出兼容性高、
符合规范的样式代码。

#### 1、cssnano

> `cssnano` 是基于 `Postcss` 的一款功能强大的插件包，它集成了近30个插件，只需要执行一个命令，就可以对我们的 `css` 做多方面不同类型的优化

#### 2、postcss-salad

> `postcss-salad` 同样是基于 postcss 的插件包，它提供了一系列快捷的 at-rule 和默认语法声明来帮助你快速地搭建项目样式与类库，
它只在调用时才输出代码，而不是直接提供 CSS 类库。

`postcss-salad` 插件包括如下本项目使用的插件，并提供插件本身对应的功能：

- `saladcss-bem` 插件，是一个实现样式 BEM 命名的 Postcss 插件，该命名规范可分为：[BEM 和 SUIT](#bemsuit) .
关于: [BEM](https://www.w3cplus.com/PostCSS/using-postcss-with-bem-and-suit-methodologies.html)
 [BEM概念](https://juejin.im/entry/58e605d80ce46300584a1afb)
- `postcss autoprefixer` 插件，`Autoprefixer` 是一个后处理程序，你可以同 Sass，Stylus 或 LESS 等预处理器共通使用。
它适用于普通的 CSS，而你无需关心要为哪些浏览器加前缀，只需全新关注于实现，并使用 W3C 最新的规范。
- `postcss cssnext` 插件，`cssnext` 能够让你使用下一代 css 语法，包括 `自定义的变量`、`自定义媒体查询`、`自定义选择器` 以及 `选择器嵌套`.
目前 css4 还没有各浏览器支持，但可以使用 `cssnext` 来把css4的语法翻译成 css3。
- `postcss-short` 插件，提供常用属性的缩写声明规则。关于：[postcss-short](https://github.com/jonathantneal/postcss-short)
- `postcss-shape` 插件，提供了基础图形快捷声明，如矩形、圆形、三角形等。关于: [postcss-shape](https://github.com/baiyaaaaa/postcss-shape)
- `postcss-utils` 插件，提供了 CSS 中常用代码片断的快捷声明，如清除浮动，文本超长溢出省略号、垂直居中、图片代替文字等。关于[postcss-utils](https://github.com/baiyaaaaa/postcss-utils)

#### 3、关于 BEM 和 SUIT 命名规范 <span id='bemsuit'></span>

我们使用 SUIT 规则.

> BEM是由@Yandex提出的一种类名命名方式。SUIT是基于BEM上的另一种类名命名方式，只不过@Nicholas Gallagher在BEM的基础上做了一些调整。
BEM能做的事情，SUIT都可以做，但很多用户觉得SUIT是BEM的一种改进。著作权归作者所有。

##### 3.1 BEM 命名规范

- Block

在BEM中Block是设计中的最高一级，整个网站都是由很多个块构建而成。一个块在网站上是独立的，理论上说块可以放置在你的布局的任何一个地方，
甚至还可以嵌套在另一个块里面。
例如，在你的网站上的搜索表单块，你就可以使用.search-form类来表示。

- Element

在BEM中的Element其实是Block中的一个元素。使用两个下划线__将元素的名称附加到其父块的名称后。
例如，一个搜索表单可能包括标题、文本框和提交按钮等元素，那么它们的类名可以命名成：.search-form__heading，.search-form__text-field和.search-form__submit-button。

- Modifier

在BEM中Modifier是应用于Block或Element表示改变的描述，或者是状态改变。修饰符名称一般附加在Block或Element的后面。

在BEM的官方网站上，修饰符使用的一个_做为分隔符。但@Harry Roberts提供了一份类似于BEM的CSS指南规范中(把这种称为BEM-like方法)，使用两个破折号--做为分隔符，而且这种方式比BEM官方提供的命名方式使用更为广泛。
例如，在设计中你可能希望提供一个高级搜索表单的样式不同于常规的搜索表单样式。因为创建了一个修饰符(Modifier)来作为区分：BEM官网的命名方式.search-form_advanced，BEM-like的命名方式：.search-form--advanced。
比如例外一个例子，你希望给提交了一个无效内容，而此时你想要改变表单的外观状态。这样你也可以创建一个修饰符。.search-form_invalid(BEM官方)，.search-form__invalid(BEM-like)。

##### 3.2 SUIT 命名规范

> SUIT包括结构(Utilities)和组件(Components)。组件(Components)中又可以有修饰符(Modifiers)、后代(Descendants)和状态(States)。

SUIT使用Pascal命名法、驼峰命名法和破折号。在BEM中，约定命名使用到的破折号和下划线的数量，常常给人带来困惑。
例如，在BEM中的命名方式.search-form__text-field和SUIT的命名方式.SearchForm-textField。

- Utilities

Utilities是用来处理结构和位置方面的样式，组件中也可以用这种方式来写。常常在驼峰命名前加一个u-前缀。例如.u-clearFix。

- Components

SUIT中的Components就相当于BEM中的Block。组件的命名方式常常使用pascal命名，也更适合SUIT，使它们更容易识别。例如.SearcForm。

- 组件命名空间

组件可以在命名前加一个nmsp-这样的命名空间，用来防止类名的冲突。比如.mine-SearchForm。

- Descendants

SUIT中的Descendants相当于BEM中的Element。它使用破折号-和驼峰命名结合在一起来。例如.SearchForm-heading，.SearchForm-textField和.SearchForm-submitButto。

- Modifier

SUIT中的Modifier和BEM中的一样，但SUIT对他们的角色控制的更为严格。SUIT中的Modifier只用于组件(Components)上，不用于Dedicated上。
它也不能用于表示状态(State)变化，就算要用于状态的变化，SUIT也有自己一套专用的命名约定。
Modifier都用两个破折号--来连接，例如：SearchForm--advanced。

- State

State是用来反映组件更改的状态。通过不同的修饰词，反映出组件修改后的基本外观。如果有必要，State也可以应用于Descendent中。
State一般都在驼峰命名前添加is-前缀。如：.SearchForm.is-invalid。


