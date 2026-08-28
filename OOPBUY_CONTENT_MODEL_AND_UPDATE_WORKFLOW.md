# Oopbuy 内容模型与长期更新流程

状态：设计提案，等待批准。

## 1. Question 内容模型

```yaml
id: q_oopbuy_qc_access
slug: where-can-i-see-oopbuy-qc-photos
question_original: "Where can I see Oopbuy QC photos?"
direct_answer: ""
steps: []
verified_facts: []
unknowns: []
faq: []

primary_keyword: oopbuy qc photos
search_intent: qc_visual_research
topic: qc
priority_score: null
publish_decision: hold

reddit_evidence_count: 1
reddit_urls: []
google_query: oopbuy qc photos
google_evidence_type: autocomplete
google_evidence_date: 2026-08-25
search_volume: Unknown
trend_direction: null
frequency_classification: multi_source_signal
frequency_reason: "One Reddit question plus a matching Google suggestion cluster; no volume data."
user_pain: "User cannot locate or distinguish relevant QC images."

official_fact_source: null
fact_status: unknown
verified_at: null
review_due_at: null

related_question_ids: []
related_products: []
curicart_urls: []
utm_campaign: oopbuy
utm_content_template: "{question_id}-{placement}"

status: draft
content_review_status: pending
fact_review_status: pending
seo_review_status: pending
owner: oopbuy_question_site
reviewer: null
approved_at: null
published_at: null
updated_at: null
archived_at: null
archive_http_status: null
```

## 2. Evidence/Source 模型

```yaml
id: src_001
question_id: q_oopbuy_qc_access
source_type: reddit | google_autocomplete | google_paa | google_serp | youtube | official | curicart
url: ""
title: ""
publisher_or_channel: ""
published_at: null
checked_at: ""
claim_scope: demand | opinion | demonstration | platform_fact | product_data
supports: ""
does_not_prove: ""
status: active | unavailable | replaced | pending_review
replacement_url: null
```

原始需求证据还必须保留：Reddit URL、可见日期、问题原意摘要、回复共识、分歧/异常；Google query、采集时间、地区、语言、来源类型和去重方法。Autocomplete 建议词出现数只能记为数据集计数，不得写入 `search_volume`。

来源角色固定：Reddit=需求和社区意见；Google=搜索需求；YouTube=公开演示/体验；Oopbuy 官方页=平台事实；CuriCart=商品图片、SKU、参考价格和 source link。

## 3. YouTube 视频记录

```yaml
youtube_url: ""
video_id: ""
title: ""
channel: ""
published_at: null
checked_at: ""
relevant_question_id: ""
key_timestamps: []
what_it_demonstrates: ""
what_it_does_not_prove: ""
embed_status: active | unavailable | geo_blocked | private | pending_review
replacement_url: null
```

规则：仅公开 URL；官方 Embed/oEmbed；不下载、剪辑、重托管视频或缩略图；最多 1–2 个；无 autoplay；16:9 固定响应式空间；click-to-load；优先 `youtube-nocookie.com`。无视频时完全不渲染模块。视频失效时才显示原创摘要、原始 URL、`checked_at` 和 “queued for review”；正文仍须完整。播放量/点赞/评论仅在当前可验证时记录，不能证明事实。辅助视频默认无 `VideoObject`。

`video-analyze` 的默认下载/抽帧流水线与本项目“不得下载”规则冲突，因此本项目只采用其分析输出字段：主题、关键时间点、演示步骤、相关性、限制。未来视频必须通过官方可访问页面或允许的元数据/字幕方式人工核验，不运行下载步骤。

## 4. Related Product 模型

```yaml
product_id: ""
title: ""
cover_image_url: ""
curicart_category_id: ""
curicart_category_name: ""
sku_summary: []
sizes: []
price_reference:
  amount: null
  currency: null
  is_final: false
source_status: active | unknown | unavailable
source_checked_at: null
curicart_canonical_url: ""
updated_at: ""
placement_reason: ""
alt_text: ""
image_width: null
image_height: null
```

公开商品模块默认最多 5 个，只能来自已批准、稳定的 CuriCart 只读 API。图片使用 API 返回的真实 `cover_image_url`；图片、标题和明确 CTA 全部链接到 `curicart_canonical_url + UTM`。alt 必须基于真实商品名/品类；图片有固定宽高或 `aspect-ratio`，除首屏首张外 lazy load。加载失败时使用无误导的图像失败占位，并按数据完整性隐藏或降级整卡。

不得将图片 URL 当 canonical，不得链接图片文件或未验证 source URL，不创建本地商品详情，不下载或复制整套商品内容。API 未批准、字段不全、分类缺失、商品与问题无关、canonical 未验证、商品下架或调用失败时，公开页面不输出该卡。等待 API 字段、图片热链许可/稳定性、缓存和下架状态合同确认后才能实施。

## 5. CSV/JSON 与轻量 CMS 工作流

第一阶段建议以版本化 JSON/CSV 为内容源，后续可接轻量 headless CMS，但数据合同保持不变：

1. 编辑提交 `question`、`evidence`、`video`、`related_products` 记录。
2. 校验器检查必填字段、URL、状态枚举、事实到期、重复 slug、Title/Meta/H1 和证据门槛。
3. 频率与优先级计算生成建议值，但人工确认 `publish_decision`。
4. Content Growth Editor 完成内容审查。
5. SEO Strategy Director 审批 Primary Owner、需求、事实、原创性和索引决定。
6. 构建系统只生成 `approved/published` 内容的路由、目录、内链、canonical、Schema、sitemap 和 lastmod。
7. 失效链接扫描和事实复核产生队列，不自动发布新问题。第一版不记录搜索词，不开放 Ask a question。

## 6. 优先级字段计算

```text
priority_score =
  google_evidence_score * 0.30 +
  reddit_repetition_score * 0.25 +
  curicart_solution_score * 0.20 +
  serp_opportunity_score * 0.15 +
  information_stability_score * 0.10
```

每个分项必须保存证据理由。缺证据时不得用默认高分填补。该值是内部排序，不是流量预测。

## 7. 状态机

```text
idea
 → research_ready
 → draft
 → content_review
 → fact_review
 → seo_review
 → approved
 → published
 → review_due / archived
```

任何事实来源失效：`fact_status → unknown/expired`，`embed_status → unavailable`，创建复核任务。若证据不足以继续提供有用答案，页面保持 Hold 或撤下，不用 Unknown 凑页。严重影响 direct answer 的已发布页可临时 noindex；仍保留有价值解释内容时维持 HTTP 200，不能同时标为 404/410。

## 8. 自动检查

- 每日/每周 HTTP source check：状态码、最终 URL、超时、redirect。
- `review_due_at` 提醒：稳定事实 90–180 天，易变平台事实 14–30 天，具体周期待批准。
- YouTube oEmbed/Embed 状态检查；失效保留原始 URL 与原创摘要。
- CuriCart product canonical 抽样和 source_status 同步。
- 搜索无结果日志第一版关闭；隐私、反滥用与数据合同批准后才重新评估。
- 相同意图合并检测和跨站连续 8 词重复检查。
- 内容归属检查：Oopbuy 站不得复制 CuriCart 中立指南；CuriCart 不再完整回答同一 Oopbuy Primary Owner 意图。

## 9. 下架规则

- `archived` 内容立即从 sitemap 和 Topic/Questions 列表移除。
- 有真正等价替代页：人工批准 301。
- 无替代：按永久性判断 404 或 410，并从 sitemap/列表移除。
- 若仍保留有价值解释内容：HTTP 200 并按有效内容继续治理，不得同时标 404/410。
- 禁止保留空壳、仅跳转按钮或 Unknown 全页。

## 10. Canonical Question 与公开门槛

- 同义问题合并到一个 `canonical_question_id`；近义表达仅记录在 `query_variants`，不生成多个 URL。
- Topic 由稳定用户任务定义，禁止用近义词批量建薄页。
- Home、Questions、Topics 只消费 `status=published` 且三道审核通过、`approved_at` 非空的记录。
- `draft`、`pending`、全 Unknown、缺可靠来源、未通过重复检查的内容不得公开、不得进入 sitemap。
- 每篇必须保存独立结构、案例、FAQ、证据组合及跨站连续 8 词/语义重复检查结果。
