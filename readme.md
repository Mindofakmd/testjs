/**
目的嘛 主要是做一个通过穿参数实现页面控制的js 之后又想到了很多别的东西所以 貌似越写越多了。。。
很蹩脚的js编程水平 想必写不出来什么优雅代码的
*/
# 目前已经完成的功能
1、通过传递对象实现对页面元素的简单控制（avoid，hide，show）
2、页面序列化、反序列化（自定义 z_mode,z_row）
3、增加页面控制的指令类型（alert、checked）
4、增加校验rule（这个工作量貌似不小）


#说明
avoid： a选择了第一个 b第二个第三个不能选
hide： a选择第一个 b隐藏
show：...
if: 一些条件的判断 写了但我也没用好 哈哈 以后需要的话再优化好了

#接下来打算做的工作
1、优化 z_model定义的方式（不用每个input元素都定义）
