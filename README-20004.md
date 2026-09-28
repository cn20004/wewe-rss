# WeWe RSS 20004 Edition · 郑老师魔改版

基于 `cooderl/wewe-rss` Fork 持续魔改。

## 当前版本

v0.1.0

## 已落地功能

- 明确显示 **WeWe RSS 20004 Edition / 郑老师魔改版**
- GitHub 链接切换到 `cn20004/wewe-rss`
- 公众号历史文章功能继续沿用原版
- 文章标题搜索
- 微信公众号正文永久归档
- 正文 HTML 落库
- 正文纯文本落库
- 标题 + 正文全文搜索
- 单篇正文归档 / 重新归档
- 批量归档下一批 20 篇
- 归档状态：未归档 / 已归档 / 失败 / 归档中
- 保存失败原因
- 失败文章可直接重试
- 归档统计：总数 / 已归档 / 失败

## 数据库变更

Article 新增：

- `contentHtml`
- `contentText`
- `archiveStatus`
- `archiveError`
- `archivedAt`

状态：

- 0 未归档
- 1 已归档
- 2 失败
- 3 归档中

## 下一阶段

- 公众号名称直接搜索
- 全历史一键连续归档
- 图片下载到本地
- HTML / Markdown / JSON / ZIP 导出
- 独立失败任务页面
- 下载历史与去重
- AI 总结、金句、选题提取
