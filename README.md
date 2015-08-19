Nodejs+Express+Mongodb建站
==========================

功能
====

1. 登录注册
2. 电影录入/删除
3. 分类
4. 搜索

工作台
======

1. grunt构建并发布
2. browser-sync多浏览器调试


<!-- 需要添加的功能 -->
1. 添加表单验证
2. 错误页面处理 http://localhost:4000/admin/movie/update/55990a9d8ef863b430cf565c

<!-- 前台相关 -->
index: 首页
list: 电影列表
detail: 详情页
search: 搜索页面
login: 登录
reg: 注册

<!-- 管理后台 -->
admin: 后台首页
admin-movie-list: 电影管理（修改、增加）
admin-movie-cate: 分类管理（修改、增加）
admin-user: 用户管理


/**
 * 获取电影信息
 * 豆瓣API(http://developers.douban.com/wiki/?title=movie_v2):
 * 		ID搜索：http://api.douban.com/v2/movie/subject/#电影ID
 * 		关键词：http://api.douban.com/v2/movie/search?q={text}
 *
 * 聚合API(http://www.juhe.cn/docs/api/id/42):
 * 		影视影讯检索: http://op.juhe.cn/onebox/movie/video?key=e9229c3499ff9cad5ace2e9992fd77ee&q=罪爱你
 * 		影讯API合集(100次)：http://v.juhe.cn/movie/index?key=d74137d3c7f8e56d415e21ef720d6ff0&title=爱情
 *
 * 目前先使用豆瓣API的top250填充数据库
 * 单数为想看，否则为看过
 */