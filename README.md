# file_combinator
一个简单的静态文件合并服务器
## 需求
<p>我们要开发的是一个简单的静态文件合并服务器，该服务器需要支持类似以下格式的JS或CSS文件合并请求。</p>

> http://assets.example.com/foo/??bar.js,baz.js

<p>在以上URL中，??是一个分隔符，之前是需要合并的多个文件的URL的公共部分，之后是使用,分隔的差异部分。因此服务器处理这个URL时，返回的是以下两个文件按顺序合并后的内容。</p>

> /foo/bar.js
> /foo/baz.js

<p>另外，服务器也需要能支持类似以下格式的普通的JS或CSS文件请求。</p>

> http://assets.example.com/foo/bar.js

> [参考链接](https://nqdeng.github.io/7-days-nodejs/#6.1)
