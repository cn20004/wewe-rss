# WeWe RSS 20004 Edition · 部署说明

这是 `cn20004/wewe-rss` 的郑老师魔改版部署方式。

## 推荐部署：Docker + SQLite

要求：

- Docker 24+
- Docker Compose v2
- 服务器至少 1 GB 内存，推荐 2 GB+
- 开放 TCP 4000 端口，或者使用 Nginx/Caddy 反向代理

## 1. 获取代码

```bash
git clone https://github.com/cn20004/wewe-rss.git
cd wewe-rss
```

## 2. 创建配置

```bash
cp .env.20004.example .env
```

编辑 `.env`，至少修改：

```env
AUTH_CODE=一个你自己的复杂密码
SERVER_ORIGIN_URL=http://你的服务器IP:4000
```

如果绑定域名：

```env
SERVER_ORIGIN_URL=https://rss.example.com
```

## 3. 构建并启动

**不要使用原版 `cooderl/wewe-rss-*` 镜像。**
原版镜像不包含 20004 Edition 的魔改代码。

执行：

```bash
docker compose -f docker-compose.20004.yml up -d --build
```

第一次构建需要下载 Node/npm/pnpm 依赖，耗时取决于服务器网络。

## 4. 查看日志

```bash
docker compose -f docker-compose.20004.yml logs -f
```

## 5. 打开后台

浏览器访问：

```
http://服务器IP:4000/dash
```

如果设置了 `AUTH_CODE`，登录时填写同一个授权码。

## 6. 数据保存位置

SQLite 数据永久保存在：

```
./data/
```

升级代码前不要删除这个目录。

## 7. 更新魔改版

```bash
git pull
docker compose -f docker-compose.20004.yml up -d --build
```

Prisma 数据库迁移会由原项目的启动脚本执行。

## 8. 当前 20004 Edition 功能

- 原版公众号订阅和历史文章拉取
- 郑老师魔改版品牌与独立版本标识
- 文章标题搜索
- 公众号正文 HTML/纯文本永久归档
- 标题 + 正文全文搜索
- 单篇归档
- 批量归档 20 篇
- 未归档 / 已归档 / 失败 / 归档中状态
- 失败原因保存和重试
- 归档数量统计

## 9. 重要说明

WeWe-RSS 的公众号发现/历史列表仍依赖其原有微信读书/转发数据源。20004 Edition 当前新增的正文归档会直接访问微信公众号文章页面并保存正文。

部署完成后，先进入“账号管理”登录/添加可用账号，再添加公众号源。
