# Oopbuy 最终方向修订记录

日期：2026-08-28  
范围：仅方案与设计确认包。未编码、安装、启动、部署、注册域名、发布或提交搜索引擎。

## 已确认并写入

- 单一 Oopbuy 精品问答研究站；不是 spreadsheet 镜像、商品详情复制站或多平台模板站。
- `/questions/` 与 `/topics/` 为核心；旧 `/spreadsheet`、`/qcfinder` 分别合并；无本地产品详情。
- 第一版关闭 Ask a question、搜索日志和独立 `/products/`。
- 公开列表与 sitemap 只包含 approved/published、有可靠来源、非全 Unknown 的问题。
- 同义问题合并到一个 canonical Question；Topic 不按近义词批量生成。
- 视频采用无模块 / click-to-load / unavailable 三个互斥状态。
- 归档采用互斥的 301、404/410 或保留价值内容 HTTP 200。
- 每篇必须通过 Content Review、Fact Review、SEO Review，并满足专业问题解决页质量门槛。
- 唯一进入补官方证据阶段的候选是 “Where can I see Oopbuy QC photos?”；shipping estimate 与 additional QC 保持 Hold。
- 视觉使用 warm-white/navy/coral、克制 serif 标题、sans 正文与控件；无 Oopbuy Logo 或仿界面。

## 商品预览确认

- 每问题默认最多 5 个，与正文任务直接相关。
- 只使用获批、稳定 CuriCart 只读 API 的真实数据，并显示 CuriCart 分类。
- API 返回的真实 `cover_image_url`、标题和明确 CTA 均链接 CuriCart canonical productview + UTM。
- 不建立本地详情页，不下载或复制整套商品内容，不将图片 URL 当 canonical。
- 图片必须有真实 alt、固定尺寸/aspect-ratio、适当 lazy loading、加载失败与卡片隐藏/降级策略。

## 仍为 Unknown / 待批准

- 公开品牌名与域名。
- Oopbuy QC 当前官方页面、操作路径和事实覆盖范围。
- CuriCart API endpoint、认证、字段语义、图片热链许可/稳定性、缓存和下架合同。
- 可公开引用且与具体问题高度相关的 YouTube 候选。
- 可靠搜索量、Trends、GSC/Bing/51.LA 数据。

## 更新后设计基线

以 `design/oopbuy/06-final-direction-desktop-home-questions-v3.png`、`07`–`09` 和 `10-final-direction-system-states-v2.png` 为最终方向设计。旧版本与 rejected 目录仅保留历史，不作为实现依据。

## 总监首轮验收修正

- 删除无法由当前原始证据表逐行复核的聚合意图计数。
- 单条 Reddit 证据统一使用 `discovered_demand`，不再使用 Critical/High/Medium。
- Pre-launch 首页不显示可点击空 Topic；Topic 只有存在 approved/published 问题后才出现。
- Archive 图改成由一个 decision 节点分叉到 301、404/410、HTTP 200 三个互斥结果。
