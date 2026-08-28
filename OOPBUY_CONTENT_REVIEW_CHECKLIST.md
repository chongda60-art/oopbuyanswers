# Oopbuy 内容审核清单

## 需求与频率

- [ ] `reddit_evidence_count`、`reddit_urls` 完整。
- [ ] `google_query`、`google_evidence_type`、`google_evidence_date` 完整。
- [ ] `search_volume` 无可靠数据时为 `Unknown`。
- [ ] `trend_direction` 只有 Google Trends 证据时填写。
- [ ] 单条 Reddit 未被称为高频。
- [ ] Google/Reddit 都不支持的问题未进入首批。
- [ ] 导航、登录、优惠码词证明有独立用户价值后才立项。
- [ ] `frequency_classification` 和 `frequency_reason` 可追溯。

## 内容与事实

- [ ] 用户原始问题、Google 表达、Reddit 共识/分歧/Unknown 均已记录。
- [ ] Direct answer 在首屏/前部且独立成立。
- [ ] 单一明确搜索意图；Direct answer 简洁且直接。
- [ ] 有可执行检查步骤、失败排查、适用条件和限制。
- [ ] Reddit 综合了回复共识、分歧和异常案例，未被当成平台事实。
- [ ] Google 仅用于需求表达，Autocomplete 未被写成搜索量。
- [ ] Verified facts 与 Unknown 分开。
- [ ] 平台事实有当前 official_fact_source、fact_status、verified_at、review_due_at。
- [ ] 无费用、政策、运输、限制、时效、真实性、库存、平台能力伪造。
- [ ] 证据不足以给出有用答案时 `publish_decision=hold`，未用 Unknown 内容凑页。
- [ ] 无虚构费用、时效、库存、正品、平台能力、合作关系或操作路径。

## CuriCart 商品预览

- [ ] 模块与正文任务直接相关，不是为了导流硬插；每问题默认最多 5 个。
- [ ] 数据只来自已批准、稳定的 CuriCart 只读 API；字段完整且显示 CuriCart 分类。
- [ ] `cover_image_url`、真实标题、SKU/Style/尺码摘要、参考价格、source 状态和 canonical productview 已验证。
- [ ] 图片、标题和明确 CTA 均链接到 CuriCart canonical productview + UTM；不链接图片文件或未验证 source URL。
- [ ] 图片 alt 基于真实商品名/品类；固定宽高或 aspect-ratio；除首屏首张外 lazy load。
- [ ] 图片/API/商品失效时按合同隐藏或降级；无 fixture、占位商品、空卡或本地商品详情页。
- [ ] 已记录图片热链许可/稳定性、缓存和下架状态合同；未确认则不实施。

## YouTube

- [ ] 每条视频记录 URL、ID、title、channel、published、checked、question ID、timestamps、demonstrates/does not prove、embed status、replacement URL。
- [ ] 公开官方 Embed/oEmbed；无下载、剪辑、重托管和复制缩略图。
- [ ] 每页最多 1–2 个高度相关视频；正文不依赖视频。
- [ ] 无 autoplay；lazy load；16:9；优先 youtube-nocookie。
- [ ] 无视频时模块完全隐藏；有视频时 click-to-load。
- [ ] 失效时只保留原创摘要、原始 URL、checked date 和 queued for review；正文仍完整。
- [ ] 辅助视频未滥加 VideoObject/video sitemap。
- [ ] 无完整字幕或大段逐字引用。

## 原创性与归属

- [ ] `page_owner` 为 Oopbuy site，且 CuriCart 无同意图完整文章。
- [ ] compared existing URLs、unique evidence/task/examples、why not rewrite、cannibalization risk 完整。
- [ ] 跨站连续 8 词相同检查通过或例外已记录。
- [ ] H2/H3、FAQ、证据组合、案例、截图、CTA 未复制参考站或 CuriCart。
- [ ] 不是替换平台名的模板页。

## SEO 与发布

- [ ] 独立 Title、Meta、H1、canonical、search intent。
- [ ] Schema 与可见内容一致。
- [ ] 同一意图只有一个 canonical Question；近义词未生成薄 Question/Topic 页。
- [ ] 只有 approved/published、非全 Unknown、有可靠来源的页面进入公开列表和 sitemap。
- [ ] 归档有等价替代才 301；无替代为 404/410 并移出 sitemap；保留价值内容则 HTTP 200，状态不冲突。
- [ ] HTTP/内链/sitemap/lastmod/404-410 状态正确。
- [ ] priority score 分项有证据，且未解释为流量预测。
- [ ] Content Review 审核完成。
- [ ] Fact Review 审核完成。
- [ ] SEO Review 审核完成。
- [ ] SEO Strategy Director 最终审批完成。
- [ ] 站长发布授权已记录。
