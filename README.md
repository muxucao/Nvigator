# 一个编辑多级菜单的插件

[苜蓿草软件](http://muxucao.cn/)

[苜蓿草软件博客](https://www.ekpro.cn/)

### 插件功能如下图所示：

![多级菜单编辑](https://github.com/muxucao/Nvigator/blob/master/9930112-154ba6725046fd79.png)

### 基本使用方法

```
var nav = new Navigator('navigation-container', {
    levels: 3 // 最多层级
});

// 添加菜单项
nav.add();

// 获取结果 json
nav.get_json_data()
```

### 使用与实现详情参考
[实现原理与使用方法](https://www.ekpro.cn/article/1569207716000179)
