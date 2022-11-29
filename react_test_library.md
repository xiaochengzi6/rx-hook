## RTL 包中如何进行元素定位？

`getxxx`、`queryxxx`、`findxxxx` 这三种查找方式，这三者都有不同的区别。
1. `getxxx` 返回已查找到的元素未找到就抛错
2. `queryxxx` 查找元素，没查到的元素返回 Null 不会抛错，一般用于判断元素不存在
3. `findxxx` 异步的查找元素


通过在其后缀 `All` 之后就会查找多个元素，如果没有使用在后缀`All`的这种形式，查找元素存在多个的条件下就会抛出错误

## 1. ByRole

`ByRole`根据 role 属性来查找元素，该属性一般都是默认值比如 `<input type='checkout' role="checkout">` or `<button role='button'>` 关于更多的默认值请[查看w3](https://www.w3.org/TR/html-aria/#docconformance)

使用的方法有: `getByRole, queryByRole, getAllByRole, queryAllByRole, findByRole, findAllByRole`

> If you only query for a single element with getByText('The name') it's oftentimes better to use getByRole(expectedRole, { name: 'The name' }). 

这里去介绍了 `getByRole` 的强大特性，通常可以使用 `getByRole` 来代替 `getByText` 使用。

官方文档对于 `ByRole` 介绍了大量的细节，但是目前阶段在 jsx 结构中添加 `aria-*`这种的属性来测试组件大致上不太可能 也用不到。所以这里能够明确如何使用 getByRole 的使用方式就行。关于 `ARIA` 规则详细介绍参考[这篇文章](https://www.jianshu.com/p/be2a34f2cbe7)

> getByRole('switch') would always match <div role="switch checkbox" /> because it's the first role, while getByRole('checkbox') would not. However, getByRole('checkbox', { queryFallbacks: true }) would enable all fallback roles and therefore match the same element.

这里介绍了一个例子 如果使用 `getByRole('switch')` 来去查找元素能够找到 `<div role="switch checkbox" />` 但是如果通过 `getByRole('checkbox')` 的方式来查找元素 检索不到

> 原因：By default, it's assumed that the first role of each element is supported, so only the first role can be queried. If you need to query an element by any of its fallback roles instead, you can use queryFallbacks: true.

默认了查找方式是 role 属性中第一个值去查找，如果也想要匹配后值就需要 `queryFallbacks: true`

简单看一下定义了那些[参数](https://testing-library.com/docs/queries/byrole#options)
~~~ts
getByRole(
  // 查找元素的节点
  container: HTMLElement,
  // 匹配 role 熟悉的值
  role: TextMatch,
  // 一些其他选项
  options?: {
    exact?: boolean = true,
    hidden?: boolean = false,
    // 较为常用的，提供查找文字
    name?: TextMatch,
    description?: TextMatch,
    normalizer?: NormalizerFn,
    selected?: boolean,
    checked?: boolean,
    pressed?: boolean,
    current?: boolean | string,
    expanded?: boolean,
    queryFallbacks?: boolean,
    level?: number,
  }): HTMLElement
~~~

*ByRole的参数属性
1. aria-hidden: getAllByRole('button', { hidden: true })
2. aria-checked: getByRole('checkbox', { checked: true })
4. aria-current=“true”: getByRole('link', { current: true })
5. aria-pressed: getByRole('button', { pressed: true })
6. aria-expanded: getByRole('link', { expanded: false })
7. h1-h6: getByRole('heading', { level: 2 })
8. aria-describedby: getByRole('alertdialog', {description: 'Your session is about to expire'})


## 2. ByLabelText

这里使用的方法有 `getByLabelText, queryByLabelText, getAllByLabelText, queryAllByLabelText, findByLabelText, findAllByLabelText`

这里看一下参数
~~~ts
getByLabelText(
  // 查找元素的节点
  container: HTMLElement,
  // 匹配的文字
  text: TextMatch,
  options?: {
    // 选择器
    selector?: string = '*',
    // 严格模式默认 true
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
~~~

> This will search for the label that matches the given TextMatch, then find the element associated with that label.

这里说了它将会查找与 `TextMatch` 匹配的文字，然后找到与该标签关联的元素，

~~~tsx
// 1. 常见的
<label for="username-input">Username</label>
// 这里与之关联的元素就是 input 
<input id="username-input" /> 

// 使用 aria-labelledby 类型的
<label id="username-label">Username</label>
<input aria-labelledby="username-label" />

// 嵌套 label
<label>Username <input /></label>

// 包裹在子元素的中的文本
<label>
  <span>Username</span>
  <input />
</label>

// aria-label
<input aria-label="Username" />
~~~

使用方式 
~~~ts
import {render, screen} from '@testing-library/react
render(<Login />)
const inputNode = screen.getByLabelText('Username')
~~~

如果在查找过程中有一样的属性可以提供 `selector` options 选择器就行
~~~tsx
// 第一种
<label id="username">Username</label>
<input aria-labelledby="username" />
<span aria-labelledby="username">Please enter your username</span>


// 第二种
<label>
  Username
  <input />
</label>
<label>
  Username
  <textarea></textarea>
</label>
~~~

选择 `input` node 可以这样使用 `getByLabelText('Username', {selector: 'input'})`

> 需要注意：getByLabelText will not work in the case where a for attribute on a <label> element matches an id attribute on a non-form element.

如果 label 中的 `for` 属性和 input 元素的 `id` 属性不相等或者 for 属性与非表单元素的id 匹配那 `getByLabelText` 就查找不到元素

类似这种就能查到
~~~tsx
 <label id="username">Username</label>
 <span aria-labelledby="username">Please enter your username</span>
~~~

这种就会匹配失败, 抛出错误
~~~tsx
<section id="photos-section">
  <label for="photos-section">Photos</label>
</section>
~~~

## 3. ByPlaceholderText
`PlaceholderText`: 占位符 

方法有：`getByPlaceholderText, queryByPlaceholderText, getAllByPlaceholderText, queryAllByPlaceholderText, findByPlaceholderText, findAllByPlaceholderText`

使用该类型的方法将会检索所有元素上的 `placeholderText` 属性，并返回匹配的 `文本` 元素

简单的看一下参数
~~~tsx
getByPlaceholderText(
  // 还是要搜索的节点
  container: HTMLElement,
  // 检索的文本
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
~~~

使用方式：

~~~tsx
<input placeholder="Username" />

// 查找
import {render, screen} from '@testing-library/react'

render(<MyComponent />)
const inputNode = screen.getByPlaceholderText('Username')
~~~


## ByText 

终于到最关键的规则了...

来看一下有那些方法：`getByText, queryByText, getAllByText, queryAllByText, findByText, findAllByText`

参数：
~~~tsx
getByText(
  container: HTMLElement,
  // 匹配的文字
  text: TextMatch,
  options?: {
    // 选择器
    selector?: string = '*',
    exact?: boolean = true,
    // 排除搜索的节点 默认就 script 和 style 节点
    ignore?: string|boolean = 'script, style',
    normalizer?: NormalizerFn,
  }): HTMLElement
~~~

> This will search for all elements that have a text node with textContent matching the given TextMatch. 
这里说的很详细，查找所有元素的文本节点，并返回匹配 `文本: TextMatch` 的元素



## ByDisplayValue

使用的方法: `getByDisplayValue, queryByDisplayValue, getAllByDisplayValue, queryAllByDisplayValue, findByDisplayValue, findAllByDisplayValue`

基本参数: 
~~~tsx
getByDisplayValue(
  container: HTMLElement,
  // 匹配 value
  value: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
~~~

> 功能: Returns the input, textarea, or select element that has the matching display value.
用于返回 `input`, `textarea`, `select` 元素现实的值

具体使用
~~~tsx
<textarea id="messageTextArea" />
// 设置值
document.getElementById('messageTextArea').value = 'Hello World'
// 测试
import {screen} from '@testing-library/dom'

const messageTextArea = screen.getByDisplayValue('Hello World')
~~~

对于 `<select>` 元素它会选择与给定值相同的 `<option>` 节点

~~~tsx
<select>
  <option value="">State</option>
  <option value="AL">Alabama</option>
  <option selected value="AK">Alaska</option>
  <option value="AZ">Arizona</option>
</select>
~~~
这里有疑问，在 react 中直接使用 `const { getByDisplayValue } =  render(<MyComponent />)` 的时候能够获取到 值

~~~ts
const { getByDisplayValue } =  render(<MyComponent />)
const value = getByDisplayValue('Alaska')
console.log('value: ', value.textContent) // Alaska
~~~
但是如果使用 这样的方式 就获取不到对应的值
~~~ts
    const value = screen.getByDisplayValue('Alaska')
    console.log('value: ', value.textContent) // select 中所有的文本
~~~

## ByAltText

查找具有 `Alt` 属性的元素通常是 img 返回和 `文本` 相匹配的元素

## ByTitle
> Returns the element that has the matching title attribute.

## ByTestId
> 返回具有 data-testid 属性的元素

**参考文章**
不看参考文章巨亏!!!【网上教程非常多但是良莠不齐，找这方面的教程且挑选出来就要耗费大量的时间和精力】

1. [【零基础的先看这个学习学习】jest+testing-library/react 单元测试 react+antd 的实践(一)](https://blog.csdn.net/zw52yany/article/details/125745529)

2.[非常详细但英文版看着费劲【死啃】-RTL官方文档](https://testing-library.com/)

3.[非常推荐【入门必备】React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)

4.[强烈建议读完所有测试代码-测试案例](https://github.com/Blevs/react-testing-baseball/blob/master/src)

5.[【4的仓库看不下来先看这个】使用 React Testing Library 和 Jest 完成单元测试](https://juejin.cn/post/6844904095682134029#heading-33)[仓库地址](https://github.com/jokingzhang/rts-guide-demo/tree/master/src)
