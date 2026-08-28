# Oopbuy 实施计划（仅在方案批准后执行）

本文件不是编码授权。当前不安装依赖、不启动服务器、不修改旧源码。

## Phase 0：批准与数据合同

1. 站长批准定位、IA、设计系统、设计稿、路由取舍和公开品牌方向。
2. SEO 策略总监批准首批问题、Primary Owner、证据门槛和优先级。
3. 确认 CuriCart 只读 API endpoint、认证、字段、缓存、下架和 URL 合同。
4. 确认 Oopbuy 官方事实来源和复核周期。
5. 确认合法可用的公开 YouTube 候选；使用不下载的验证流程。

## Phase 1：保护旧文件并建立新结构

1. 记录旧 CNFans 文件哈希和清单。
2. 创建新分支/Git 提交边界；不直接覆盖旧文件，先将旧实现标记 legacy。
3. 根据当前仓库和批准技术栈建立内容驱动架构。
4. 若仍无 `.openai/hosting.json`，不强行改用 Sites。

## Phase 2：内容与数据层

1. 实现 Question/Evidence/Video/Product 模型与状态机。
2. 创建 CSV/JSON 导入、schema validation、slug/duplicate/evidence gates。
3. 实现只读 CuriCart adapter；只有获批、稳定且字段合同完整的真实 API 才能驱动公开商品预览。第一版公开页面不使用 fixture、占位卡或空卡。
4. 建立事实到期、来源链接失效和视频 oEmbed 状态。第一版不记录搜索词，也不提供 Ask a question。

## Phase 3：前端忠实实现

按设计稿逐页实现并对比：Home、Questions、Question detail、Topic、Sources、About/Contact/Privacy、mobile、loading/no-result/Unknown/source/video/product unavailable。第一版不建立 `/products/`、本地 `/product/{slug}`、Ask a question 或搜索日志。使用 frontend-app-builder 的设计 token 与组件库存，不创造未批准模块。

## Phase 4：SEO 与 Schema

1. SSR/SSG 可抓取 HTML。
2. 独立 Title/Meta/H1、self canonical、分页与筛选规则。
3. 自动 sitemap/lastmod；只包含 approved/published、HTTP 200、canonical、非全 Unknown、可靠来源完整的页面。draft/pending/archive/empty/filter 排除。
4. Schema Skill 逐页验证真实可见内容，避免 FAQ/QAPage/VideoObject 滥用。
5. SEO Audit 检查 200/404/410、canonical、robots、sitemap、内链、重复和结构化数据。

## Phase 5：性能与可访问性

1. 静态优先、按需 hydration、搜索/筛选非阻塞。
2. 图片尺寸、视频 façade 16:9、字体策略、减少 JS。
3. Performance/Core Web Vitals 在可运行 URL 上测量；不以源码推断“通过”。
4. Browser 优先做桌面和移动端验收，Playwright 备用；记录截图和报告。

## Phase 6：内容 QA

1. 需求证据、事实源、Unknown、来源角色、视频限制。
2. 跨站连续 8 词检查、Heading/FAQ/结构/案例人工审查。
3. CuriCart canonical 与 UTM 抽样；每问题最多 5 个相关完整商品，必须显示 CuriCart 分类，API/商品失效时隐藏或安全降级。
4. Content Growth Editor → SEO Strategy Director → owner 发布批准。

## 硬停止点

没有站长明确批准，不执行任何 Phase 1–6；不部署、注册域名、提交搜索引擎或修改 CuriCart。

## 已确认与仍待批准

已确认：单一 Oopbuy 精品问答站、`/questions/` 与 `/topics/` 核心路由、旧 spreadsheet/qcfinder 合并、无本地商品详情、第一版关闭 Ask/搜索日志/独立 products、warm-white/navy/coral 视觉方向。

仍待站长批准：公开品牌名、域名、CuriCart 只读 API 合同、首个问题的官方事实证据与发布许可。当前唯一进入补官方证据阶段的候选是 “Where can I see Oopbuy QC photos?”；shipping estimate 与 additional QC 继续补证，不进入发布批准。
