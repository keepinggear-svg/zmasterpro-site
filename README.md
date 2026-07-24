# 支先森制造官网 SEO / GEO 静态站

这个目录是一套可部署到 Vercel 的静态官网源码，目标是让百度、360、神马、搜狗、Bing 和 AI 助手更容易抓取、理解、引用网站内容。

## 本地生成

```bash
python3 scripts/build_site.py
```

生成结果在 `dist/`：

- `dist/index.html`
- `dist/about/index.html`
- `dist/services/index.html`
- `dist/cases/index.html`
- `dist/faq/index.html`
- `dist/contact/index.html`
- `dist/clothing-customization/index.html`
- `dist/t-shirt-customization/index.html`
- `dist/hoodie-customization/index.html`
- `dist/workwear-customization/index.html`
- `dist/oem-odm/index.html`
- `dist/robots.txt`
- `dist/sitemap.xml`
- `dist/llms.txt`
- `dist/family-flavor/index.html`（FAMILY FLAVOR 家庭点菜 PWA）

## 内容维护

案例内容已经从页面代码里拆出来，主要维护两个地方：

- 案例文字：`content/cases.json`
- 案例图片：`src/images/cases/`

详细说明见：

- `docs/网站内容维护指南.md`

家庭菜单只需要维护 `content/family-flavor-menu.json`。执行构建后，
`/family-flavor/` 会读取最新版菜单；已打开页面也会在切回前台或定时检查时同步更新。

## 本地预览

```bash
cd dist
python3 -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/`。

## Vercel 部署

`vercel.json` 已配置：

- `buildCommand`: `python3 scripts/build_site.py`
- `outputDirectory`: `dist`
- `zmasterpro.com` 到 `https://www.zmasterpro.com/:path*` 的 301 跳转
- HTTPS/HSTS 和基础安全响应头
- `sitemap.xml` 与 `llms.txt` 的内容类型

DNS 需要在域名服务商面板里保持：

- 裸域 `zmasterpro.com`：`A` 记录，主机记录 `@`，记录值 `76.76.21.21`
- `www.zmasterpro.com`：`CNAME` 记录，记录值 `cname.vercel-dns.com`

代码里的跳转配置只有在请求到达 Vercel 后才会生效。以后如果更换部署平台，以新平台仪表盘提示的 DNS 记录为准。

## 搜索提交建议

技术结构完成后，建议到这些站长平台提交：

- 百度搜索资源平台：提交 `https://www.zmasterpro.com/sitemap.xml`
- Bing Webmaster Tools：提交站点和 sitemap
- 360、神马、搜狗：按各自站长平台提交首页和 sitemap

知乎、豆瓣、小红书、公众号、视频号、抖音等不等同于搜索引擎抓取提交，适合做外链和内容种草。建议围绕“街舞校服定制”“服装定制小单”“潮牌 T 恤定制”“班服队服定制”“街舞卫衣定制”等词写真实案例和知识内容，再链接回官网服务页。
