# Oopbuy 精品问答站设计系统

状态：完整视觉概念提案。设计图中的任何示例文字都不是已批准平台事实。

## 1. 设计方向

定位为“安静的研究工具”：用户反复搜索、阅读、核对来源，而不是被营销模块推动。设计提取 Litbuy 的任务入口和商品发现路径、InVideoAI 的工具优先与清晰层级，但不复制其黑色页面、品牌色、布局、原文、图形或声明。

### 视觉原则

- Warm white 背景，不是纯黑或深色 Buy 站。
- Graphite 正文 + muted navy 标题/导航。
- Coral 只用于焦点、选中和主要操作；amber 只用于 Unknown/overdue。
- 问题标题使用克制 serif；控制与正文使用 humanist sans。
- 1px hairline 分隔，开放行和列表优先，卡片只用于明确状态/相关商品模块。
- 无渐变、无 bento、无假统计、无 testimonial、无平台 UI 复刻。

## 2. Token 建议

| Token | 建议值 | 用途 |
|---|---|---|
| Canvas | `#FCFBF8` | 页面背景 |
| Surface | `#FFFFFF` | 输入、状态面板 |
| Ink | `#122039` | 标题/主文字 |
| Body | `#273247` | 正文 |
| Muted | `#697386` | 元数据 |
| Rule | `#D9DEE7` | 分隔线 |
| Focus/Action | `#F05B4F` | 焦点与主动作 |
| Caution | `#E5A83B` | Unknown/overdue |
| Verified | `#2F7A56` | 已验证状态，仅有证据时 |

字体最终选择需确认授权与性能；首选本地/系统可回退组合。正文宽度 68–76 characters；触控目标不低于 44px；桌面内容最大宽度约 1240–1320px。

## 3. 核心组件

- Header：未批准品牌占位、Questions、Topics、Sources、About；不使用 Oopbuy Logo 或仿界面。
- Search：显著但不夸张；键盘 `/` 聚焦可作为增强，不成为依赖。
- Question row：标题、direct answer 摘要、Topic、需求证据、fact status、review date。
- Evidence label：文字优先，不用满屏 pills。
- Direct answer：每个详情页首个内容块。
- Verified/Unknown：视觉和语义区分；Unknown 文案固定为“Not verified by a current official source”。
- Source row：来源类型、标题、checked date、状态、原始 URL。
- Product preview：每问题默认最多 5 个；使用获批只读 API 的真实 `cover_image_url`、商品名、CuriCart 分类、SKU/Style/尺码摘要、参考价格和 source status。图片、标题、CTA 都进入 CuriCart canonical productview + UTM；不建立本地商品详情。
- Video evidence：正文/步骤之后，16:9 code-native façade，点击后加载 privacy-enhanced embed。
- States：loading、no results（不记录、不提交）、source unavailable、Unknown/Hold、互斥的 301/404-410/200 archive、product hidden/degraded、video unavailable。

## 4. 页面设计清单

| 设计图 | 覆盖 |
|---|---|
| `06-final-direction-desktop-home-questions-v3.png` | 无空 Topic 链接的公开 pre-launch 首页与 approved/published-only 问题库 |
| `07-final-direction-question-topic.png` | 内部 QC 候选 Hold 预览与未发布 Topic |
| `08-final-direction-mobile.png` | 移动公开首页与内部候选详情 |
| `09-final-direction-video-states.png` | 互斥的无视频/click-to-load/失效/移动状态 |
| `10-final-direction-system-states-v2.png` | 不记录搜索、Hold、隐藏商品、图片失败、归档决策三分支 |

`01`–`05`、第一版 `06-final-direction-desktop-home-questions.png` 与 `90-draft-state-board-rejected-content.png` 均为被最终方向取代的历史概念，不得作为实现依据。

## 5. 视频模块状态

- 有视频：direct answer 和 checklist 之后；展示 title/channel/published/checked/key timestamps/what it demonstrates/does not prove。
- 无视频：模块完全不渲染，页面从 checklist 自然进入后续内容。
- 视频失效：保留原创概括、原 YouTube URL、checked date、`queued for review` 和 replacement_url。
- 移动端：16:9 占位，不 autoplay，点击加载，正文在视频前完整成立。

## 6. 可访问性与性能目标

- WCAG AA 对比度，完整键盘导航和可见 focus。
- 语义搜索、筛选 label、状态 live region、错误不只靠颜色。
- 固定图片和视频尺寸，避免 CLS。
- 首屏无大图；优先服务器 HTML 和极少客户端 JS。
- 列表加载保留空间；第一版无结果不记录、不提交用户查询。
- 商品图片使用真实商品名/品类生成 alt，固定 `width`/`height` 或 `aspect-ratio`。除首屏首张外 lazy load。加载失败先保持固定比例的中性失败状态，再按字段完整性隐藏或降级卡片。
- 实现后用 Browser 优先验收，Playwright 备用；Core Web Vitals 只有实际 URL 测量后才能下结论。

## 7. 已确认与待决定

已确认：warm white + navy + coral；克制 serif 标题与 sans 正文/控件；每问题最多 5 个强相关商品；视频 click-to-load；无视频不渲染模块。

待决定：公开品牌名和域名。待合同：CuriCart API 字段、图片热链许可/稳定性、缓存和下架语义。
