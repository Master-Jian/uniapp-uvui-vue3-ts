# 关于此项目文档

这是本人总结和参考后总结出来的,,本人对错误提示是零容忍,且整理不易,喜欢去github点个star

- [github](https://github.com/Master-Jian/uniapp-uvui-vue3-ts.git)

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/Master-Jian/uniapp-uvui-vue3-ts.git
```

- 安装依赖

```bash
cd uniapp-uvui-vue3-ts
npm install

```

- 运行: 参考 package.json

```例如
npm run dev:h5

```

## 处理报错提示

- uni.$uv警告

```uni
从uni进去,第一行添加
interface Uni {
    /** 添加$uv类型 */
    $uv: any;
}
```

## 关于处理uv-ui的sass的统一处理方式

本人已经处理了,详情可以看issues,官方暂时没有合并

- [uv-ui-issues](https://github.com/climblee/uv-ui/issues/163)
- [uv-ui-pull](https://github.com/climblee/uv-ui/pull/164)

## 关于目录和组件

- 目录就不过多的介绍了,本人是vben框架的爱好者,结构如api基本模仿vben
- 关于组件pageList可以如果demo无法看懂,可以玩下vben的table,按照此模仿
- 至于pinia玩法,也是类似vben,写法在app.vue
- 关于git提交强配置已经其他,我就不建议,毕竟有些人不会处理,喜欢自己就自己配置,以及elint
- [vben](https://github.com/vbenjs/vue-vben-admin?tab=readme-ov-file)

## 关于建议

- 如果不是非得需要的情况,建议尽量分包开发,毕竟使用了组件包
- 如果有觉得有更好的配置,欢迎在github上跟我说

## 希望对你有帮助,也学到了东西,喜欢可以支持下作者喝杯咖啡,未来会开发模板 RN/Flutter/Android/IOS/鸿蒙/官网

![Image](https://github.com/user-attachments/assets/04e3e021-206c-4e4e-ac21-a29efc4c1f5e)


