# Oopbuy 研究综合与问题优先级

## 证据规则

- Reddit 证明用户问题、评论共识/分歧和痛点，不证明平台事实。
- Google Autocomplete 证明当前存在建议词，不等于月搜索量。
- YouTube 证明作者公开展示/讨论的内容，不证明费用、政策、运输、限制、时效或平台能力。
- 官方 Oopbuy 页面才可支持当前平台事实；无法核验为 `Unknown`。
- CuriCart 只支持真实商品图片、SKU、参考价格、source link 和 canonical product URL。

## 需求概览

本确认包的原始证据表逐行保留了当前用于判断的 QC photos/finder/viewer、spreadsheet with QC 与 product links 查询。其他聚合意图计数未在 `OOPBUY_RAW_DEMAND_EVIDENCE.csv` 中逐行展开，因此本报告不再引用这些计数。没有可靠搜索量和 Trends 证据。

Reddit 当前记录五个 Oopbuy 发现需求：QC access、extra QC、shipping cost、QC delay、product browsing。每个主题当前只有一条独立 URL，统一标为 `discovered_demand`；不得使用 Critical/High/Medium 或“高频”描述。

## 候选 Top 问题

| Rank | Question | Google evidence | Reddit evidence | Frequency | Publish decision |
|---:|---|---|---:|---|---|
| 1 | Where can I see Oopbuy QC photos? | QC cluster, Autocomplete, 2026-08-25 | 1 URL | multi_source_signal | Only candidate allowed to seek official evidence; not approved for publication |
| 2 | Why is the Oopbuy shipping estimate high? | Corresponding Google row not retained in the auditable table | 1 URL | discovered_demand | Hold; continue demand and official-fact research |
| 3 | How can I request additional QC photos? | Broader QC cluster | 1 URL | discovered/partial second signal | Hold; exact Google query and official facts incomplete |
| 4 | Why are my QC photos delayed? | Broader QC cluster | 1 URL | discovered demand | Hold for another demand/official source |
| 5 | How can I browse Oopbuy spreadsheet products on mobile? | Spreadsheet/product discovery cluster | 1 URL | multi_source_signal | Topic/Questions entry, not generic catalog page |
| 6 | Why is an Oopbuy product link not working? | Product/source links cluster | 0 confirmed Oopbuy Reddit row | Google-only signal | Hold |
| 7 | How do I compare SKU, size and color before continuing? | QC/spreadsheet/link clusters | 0 confirmed Oopbuy-specific row | broad signal | Hold; consider CuriCart-neutral ownership |

## Current editorial gate

只有 QC access 可进入“补当前官方证据”的候选阶段。具体入口、图片类型和当前操作路径未由第一方来源核验前，仍为 Hold，不能写完整文章或批准发布。

Shipping estimate 与 Extra QC 继续补需求证据和官方事实，不进入 brief 批准或发布队列。不得给通用费用、节省比例、时效、免费额度、截止时间或处理能力结论。

本轮不写完整文章。

可复核的行级需求证据见 `OOPBUY_RAW_DEMAND_EVIDENCE.csv`；其中建议词计数是研究数据集计数，不是搜索量。

## YouTube 研究状态

公开搜索未返回可验证的 Oopbuy 专题视频，候选为空。`youtube_url/video_id/title/channel/published_at/key_timestamps` 均为 Unknown。后续收到候选 URL 后，按 video-analyze 字段做不下载的人工分析；无法获得公开元数据和时间点则不嵌入。
