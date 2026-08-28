# Oopbuy 精品问答研究站策略

状态：提交站长与 SEO 策略总监确认。未批准编码、部署、域名注册、发布或搜索引擎提交。

## 1. 结论

本项目应从旧的“CNFans 商品表格/商品详情样品”改为一个 **Oopbuy 专题精品问答研究网站**。首页直接提供问题搜索，问题页先完整解决用户任务，再以相关 CuriCart 商品预览作为辅助信息。网站不是 Oopbuy 官方站、不是多平台站、不是 spreadsheet 镜像、不是商品详情复制站，也不是只负责跳转的门页。

研究资料将 Oopbuy 评为当前产品型试点的 GO 候选，内部产品试点评分为 82、编辑评分为 80。该分数只是内部优先级模型，不代表流量、市场份额、用户规模或排名预测。搜索量目前为 `Unknown`。

## 2. 证据基础

### 已验证为需求信号

- Google Autocomplete 原始需求表当前逐行保留了 QC photos/finder/viewer、spreadsheet with QC 和 product links 等已纳入本轮判断的查询。未逐行进入 `OOPBUY_RAW_DEMAND_EVIDENCE.csv` 的意图聚合计数不在本确认包中引用。Autocomplete 只表示建议词，不是月搜索量。
- Reddit 数据记录了 Oopbuy 用户关于查看 QC 图片、请求额外 QC、运输估算偏高、QC 图片延迟、移动端 spreadsheet/分类/QC 浏览的具体问题。
- 可见 SERP 中已有 searchable catalog、country spreadsheet landing page、exact-match spreadsheet 等页面模型。竞争正在增长，但研究认为低于 Kakobuy 的精确匹配拥挤度。

### 仍为 Unknown

- Oopbuy 当前费用、物流公式、处理时效、支持范围、限制、政策和服务承诺。
- 每个 Reddit 回复所描述的操作是否仍适用于当前 Oopbuy 页面。
- 可公开使用的 CuriCart 只读 API、商品数据授权、分类 200 URL、下架信号和缓存规则。
- 可靠月搜索量、Google Trends 方向、GSC/Bing/51.LA 表现。
- 公开品牌名和域名。
- 可验证且高度相关的 Oopbuy YouTube 候选。本轮公开检索噪声较大，未确认任何候选视频。

## 3. 核心用户任务

1. 快速找到一个 Oopbuy 问题的直接答案。
2. 区分社区讨论、Google 需求信号、公开视频演示、官方事实和 CuriCart 商品数据。
3. 在继续操作前核对 QC 图片、商品链接、SKU/Style、尺码、颜色和来源状态。
4. 理解哪些结论已验证、哪些已过期、哪些仍需用户到 Oopbuy 当前页面自行确认。
5. 从问题页自然进入已验证的 CuriCart canonical productview 页面，而不是被欺骗性跳转。

## 4. 内容优先级模型

每个候选问题按以下内部权重评分：

| 维度 | 权重 | 评分依据 |
|---|---:|---|
| Google 需求证据 | 30% | Autocomplete、相关搜索、PAA、SERP 页面类型；未来可加入 GSC/Trends/Keyword Planner |
| Reddit 重复痛点 | 25% | 独立帖子/评论数量、追问和争议；单帖不能单独称为高频 |
| CuriCart 可解决能力 | 20% | 能否提供真实图片、SKU、尺码、参考价格、source link、canonical product URL |
| 当前 SERP 机会 | 15% | 可见页面模型、内容薄弱点、工具缺口，不声称精确排名 |
| 信息稳定性 | 10% | 官方来源可核验程度、事实变化风险、复核成本 |

`priority_score` 只用于内部排序，不是流量或收入预测。

### 频率分类

- `discovered_demand`：只有一条 Reddit 证据，或只有一个搜索需求来源。
- `multi_source_signal`：Reddit 问题获得 Google 第二来源支持，或多个独立 Reddit 来源表达同一痛点。
- `repeated_pain`：至少多个独立社区证据且问题含重复追问；仍不等于全体用户高频。
- `high_frequency`：只有达到预先记录的多源门槛且通过人工复核后才能使用。当前首批问题不默认获得该标签。

## 5. 首批候选问题与发布判断

| 问题 | Reddit | Google | 当前频率判断 | 建议 | 事实边界 |
|---|---|---|---|---|---|
| Where can I see Oopbuy QC photos? | 1 个问题帖 | `oopbuy qc/photos/finder/viewer` 建议词簇 | multi-source signal | 唯一获准补官方证据的候选；未批准写作/发布 | 具体入口和覆盖范围需官方核验 |
| How can I request additional QC photos? | 1 个问题帖 | QC 需求簇支持，但精确问题词需再核 | discovered to medium | Hold；继续补证 | 费用、免费张数、时限均 Unknown |
| Why is the Oopbuy shipping estimate high? | 1 个问题帖 | 当前原始证据表未保留对应 Google 查询行 | discovered_demand | Hold；继续补证 | 公式、路线、附加费不能从 Reddit 推断 |
| Why are my QC photos delayed? | 1 个问题帖 | QC 簇存在，精确 delay 词需再核 | discovered demand | Hold/补证据 | 不承诺处理时间 |
| Why is an Oopbuy product link not working? | 当前无对应 Oopbuy Reddit 行 | 原始证据表保留 `oopbuy product links` Google Autocomplete 查询 | google_only_signal | Hold，补 Reddit/官方证据 | 不推断平台支持状态 |
| How do I compare SKU, size and color before continuing? | 当前 Oopbuy 专属证据不足 | QC + spreadsheet + source-link 簇支持 | broad task signal | CuriCart 支撑能力高，但需 Oopbuy 证据 | 不生成平台特定结论 |

首批实际写作顺序必须由 SEO 策略总监基于补证后的字段重新确认。Google 与 Reddit 均无支持的问题不进入首批内容。

## 6. 页面价值与差异化

- 与 spreadsheet 竞品不同：主产品是可搜索的问题库，商品预览服务于问题，不是大量商品页复制。
- 与大型 catalog 竞品不同：不以产品数量、每日更新、verified/trusted 等无法证明的声明竞争。
- 与普通文章站不同：每个答案含事实状态、验证日期、到期日期、Unknown、来源角色、相关问题、相关商品和更新记录。
- 与 CuriCart 主站不同：Oopbuy 站只拥有 Oopbuy 特定问题意图；CuriCart 保留 canonical 商品和平台中立研究的 Primary Owner。

## 7. 旧 CNFans 假设替换清单

旧文件必须保留到站长批准后再处理；本轮不删除、不改源码。

- `TARGET_AGENT=CNFans`、CNFans Title/Meta/H1、CNFans 独立声明需全部替换。
- 旧首页的“产品搜索 + 商品发现表格”不是新首页信息架构。
- `/spreadsheet` 合并到 `/topics/spreadsheet/`，不再是一级路由。
- `/qcfinder` 不保留为独立空工具页；合并到 `/topics/qc/`，将来只有真实 QC 数据源后再评估交互工具。
- `/category/[slug]` 与独立 `/products/` 第一版不建立。CuriCart 分类只作为问题页真实商品预览的必要字段。
- `/product/[slug]` 不保留：商品卡直接进入 CuriCart canonical productview URL，避免复制详情。
- `/request-product`、Ask a question 与搜索日志第一版关闭，等待隐私、反滥用和真实数据合同完善。
- 旧 fixture 商品、SVG、API adapter、Schema、sitemap、robots 和 analytics 代码均是未验证旧实现，不应复用为新站事实。

## 8. 发布与治理边界

- 状态流：`draft → content_review → fact_review → seo_review → approved → published → archived`。
- Content Review、Fact Review、SEO Review 三道审批缺一不可；未通过不发布。
- 公开首页、Questions、Topics 只显示 `approved` 且 `published` 的问题。draft、pending、全 Unknown、缺可靠来源内容不得公开或进入 sitemap。
- 每个核心搜索意图只有一个 Primary Owner；发布前执行跨站连续 8 词完全相同检查与人工结构/证据/用户任务检查。
- 不使用 Official/Authorized，不复制 Oopbuy Logo 或界面体系，不声称合作。
- 本轮只提交策略和设计，不写完整文章。

## 9. 需要站长批准

以下方向已经确认：精品问答研究工具定位、`/questions/` 与 `/topics/` 核心路由、旧 spreadsheet/qcfinder 合并、无本地商品详情、第一版关闭 Ask/搜索日志/独立 products，以及 warm-white/navy/coral 视觉方向。

仍需站长批准或补齐：

1. 公开品牌名与域名方向。
2. CuriCart 只读 API 字段、热链许可/稳定性、缓存和下架合同。
3. “Where can I see Oopbuy QC photos?” 的当前官方事实来源与发布许可。
4. YouTube 候选来源方式；当前无可验证候选。

Shipping estimate 与 additional QC 仅继续补证，不进入发布批准。

## 10. 专业问题解决页发布门槛

每页必须服务一个明确搜索意图，并提供简洁 direct answer、可执行检查步骤、失败排查、适用条件和限制。Reddit 只支持痛点、用户语言、共识、分歧和异常案例；Google 只支持需求表达；Oopbuy 平台事实只接受当前第一方页面或官方文档，其他均标 Unknown。易变事实必须记录 source URL、`checked_at`、`verified_at`、`review_due_at`。

商品模块只能在与正文任务直接相关时显示，不得为导流硬插。每篇必须使用独立结构、案例、FAQ 和证据组合，并通过站内及 CuriCart 跨站语义/连续重复检查。证据不足以给出有用答案时保持 Hold，不用 Unknown 内容凑页，也不得虚构费用、时效、库存、正品、平台能力、合作关系或操作路径。
