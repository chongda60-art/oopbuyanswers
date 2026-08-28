# Oopbuy 精品问答站信息架构

状态：设计提案，等待批准。

## 1. 建议站点树

```text
/
├── questions/
│   └── {question-slug}/
├── topics/
│   ├── qc/
│   ├── product-links/
│   ├── spreadsheet/
│   ├── shipping/
│   └── sku-size/
├── sources/
├── about/
├── contact/
└── privacy/
```

首页是问答搜索，不是营销落地页。`/questions/` 是唯一全量可搜索问题库；Topic 页负责聚合明确主题并解释主题边界，不批量制造近似页。

## 2. 路由建议

| 旧路由 | 建议 | 原因 |
|---|---|---|
| `/spreadsheet` | 合并至 `/topics/spreadsheet/` | 新站核心是问题，不是 sheet 镜像 |
| `/qcfinder` | 合并至 `/topics/qc/`；真实 QC API 到位后再评估独立工具 | 目前没有可验证 QC 数据源 |
| `/category/[slug]` | 不保留原形式 | 商品分类并非首要内容；避免薄分类页 |
| `/product/[slug]` | 不保留 | 商品预览应链接 CuriCart canonical productview，避免复制详情 |
| `/request-product` | 第一版关闭，不提供提交入口 | 隐私、反滥用和真实数据合同尚未完成 |
| `/products/` | 第一版不建立 | 商品只作为问题页的辅助预览，不建立独立目录 |

## 3. 首页结构

1. 简洁 Header：Questions、Topics、Sources、About。
2. H1 + 问题搜索框。
3. 快速任务：QC、shipping、product links、spreadsheet、SKU/size。
4. Most researched questions：只展示 `approved` 且 `published` 的问题。
5. Topic 入口：文字列表或开放行，不用营销卡片墙。
6. Sources & limits：明确每种来源证明什么。
7. 最近复核的问题与变更记录（只显示已发布内容的真实更新）。

第一版不提供 “Ask a question”，也不记录站内搜索词。搜索为本地只读筛选；无结果只显示帮助文字，不提交或保存用户输入。

## 4. 问题库 `/questions/`

### 筛选

- Topic
- Google evidence type
- Reddit evidence count/frequency classification
- Fact status：verified / partially_verified / unknown / expired
- Review state：current / due / overdue
- Updated time

筛选参数默认不形成可索引 URL。只有经审批、有独立需求和足够内容的稳定 Topic 才拥有 canonical index page。

### 结果行

Question、direct-answer 摘要、topic、需求证据、fact status、last reviewed。避免用大卡片网格。

## 5. 问题详情 `/questions/{slug}/`

固定信息职责，不固定 H2 文案顺序：

1. Breadcrumb + 唯一 H1。
2. Direct answer。
3. Evidence/frequency 摘要，明确 search volume Unknown。
4. 针对问题的步骤或检查表。
5. Verified facts。
6. What remains unknown / user must confirm。
7. 可选 YouTube 公共演示（正文之后；最多 1–2 个）。
8. Sources，按 Reddit/Google/YouTube/Official/CuriCart 分类。
9. Related questions。
10. Related CuriCart products（默认最多 5 个；只在获批、稳定的 CuriCart 只读 API 返回完整且与当前问题相关的真实数据时显示）。

## 6. Topic 页

Topic 页不是文章模板复制，而是任务入口：

- `/topics/qc/`：查看、请求、延迟、SKU/size 图片核对。
- `/topics/product-links/`：失效、来源链接、redirect/支持状态等问题。
- `/topics/spreadsheet/`：表格浏览、移动端、分类与更新状态。
- `/topics/shipping/`：估算、重量、路线、追踪；事实必须官方核验。
- `/topics/sku-size/`：版本、Style、颜色、尺码和图片对应。

每页必须有主题定义、问题列表、证据/事实筛选、来源说明和邻近主题链接。空 Topic 不发布、不入 sitemap。

## 7. 问题页商品预览门槛

第一版不建立 `/products/`。只有以下条件同时满足时，问题页才可显示商品预览：

- 只读 CuriCart API 已批准并稳定返回真实公开商品。
- canonical productview URL 抽样返回 200。
- 图片、SKU、尺码、参考价格、source status 和 updated_at 有明确语义。
- 每张商品卡与当前问题或 Topic 直接相关；每页默认最多 5 张。
- 卡片明确显示对应 CuriCart 品类/分类信息。
- 无空分类、无复制商品详情、无伪造库存/价格。
- 公开页面不得输出 fixture、占位卡或空卡。

卡片可显示真实图片、商品名、CuriCart 分类、SKU/Style/尺码摘要、参考价格和 source 状态，但不复制完整商品详情。整张卡或明确 CTA 直接跳转真实 CuriCart canonical productview URL并附 UTM。API 异常或商品失效时隐藏相关卡片；若仍有部分可靠数据，只能降级到不误导的最小状态，且不得生成本地详情页。

商品卡点击 URL：

```text
{curicart_canonical_url}
?utm_source=oopbuy_question_site
&utm_medium=referral
&utm_campaign=oopbuy
&utm_content={question_id}-{placement}
```

UTM 不改变 CuriCart canonical 身份。

## 8. 内链模型

```text
Home → approved/published Questions + Topics
Topic → member Questions + adjacent Topics
Question → parent Topic + related Questions + relevant CuriCart products
Product preview → CuriCart canonical productview
Sources → methodology referenced by every Question
```

不创建仅跳转 CuriCart 的页面。不根据关键词变体生成多个同义问题页；同一答案意图合并到一个 canonical Question。

## 9. 索引规则

仅当页面满足以下条件才可进入 sitemap：HTTP 200、自引用 canonical、唯一 Title/Meta/H1、状态同时为 `approved` 与 `published`、direct answer 完整、至少一条可靠来源、不是全 Unknown、事实状态可见、lastmod 来自真实内容更新、内部可达、通过跨站重复检查。

- Draft/pending/review/all-Unknown/缺可靠来源/empty/filter/search/no-result：不得进入公开列表或 sitemap；预览环境必须鉴权或 `noindex`。
- Archived：从 sitemap 和列表移除；有真正等价替代则 301；无替代则 404/410。若保留有价值的解释内容则维持 HTTP 200，并以更新后的公开内容状态管理，不能同时标记 404/410。
- Topic 无已发布问题：不生成公开页。
- Source 失效不自动删除文章；保留原创答案，降级状态并进入复核队列。

## 10. Schema 计划（实现阶段）

- Question detail：仅在页面内容与 Google/Schema 资格条件匹配时评估 `FAQPage`；默认优先 `Article`/`WebPage` + `BreadcrumbList`，不滥用 `QAPage`。
- Questions/Topic：真实列表可用 `ItemList`。
- Product preview：不在问答页伪造完整 `Product`/`Offer`；只输出页面真实可见数据。
- Supporting YouTube embed：默认不输出 `VideoObject`。只有视频为页面核心、首屏主要内容且元数据完整时单独评估。

最终类型必须由 Schema Skill 在实现阶段逐页验证。

## 11. 同义问题与 canonical

- 同一搜索意图只保留一个 canonical Question。
- Google/Reddit 的近义表达记录为 `query_variants`，不各自生成 URL。
- 新问题在进入审核前执行 slug、意图、标题、direct answer 和现有 URL 去重。
- Topic 只按稳定用户任务建立，不以近义关键词批量制造薄页。
