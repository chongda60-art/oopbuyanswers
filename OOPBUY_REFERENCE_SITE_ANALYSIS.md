# Oopbuy 参考站分析：Litbuy 与 InVideoAI

检查日期：2026-08-25。仅记录公开可见页面。竞品声明未经独立核验，不能成为本站事实。

## 1. Litbuy.net

### 可观察证据

- 首页顶层提供 Hot Selling、New Arrivals、Shoes、T-Shirts、Tops、Accessories、Tracksuits、Pants、Electronics 分类入口。
- 页面提供 Product Search、Browse Product Finds 和 Request a Product 入口。
- 页面把 Hot Selling、New Products、Recent Updates、Product Sheet 和 FAQ 组合在同一发现流程。
- FAQ/正文声称商品数量、更新频率、QC、价格、优惠、物流和费用等；这些都是该站自身声明，本项目不采信为事实。
- 页面底部有独立性和外部平台免责声明。

### 可借鉴部分及对应需求

| 方法 | 解决的 Oopbuy 问题 | 研究证据 |
|---|---|---|
| 搜索 + 分类入口并列 | spreadsheet 用户需要移动端搜索、分类与直接页面 | Reddit product browsing；Google spreadsheet 10、links 9 |
| 新增/更新状态可见 | 用户需要判断链接和内容是否过期 | Reddit product browsing；SERP 强项含 update label |
| Product Sheet 作为第二浏览方式 | 同时满足 spreadsheet 与网站比较用户 | Google spreadsheet intent；Reddit mobile browsing |
| 商品到目标站的明确动作 | 用户希望核对后继续到 canonical 产品页 | CuriCart product-intercept fit 5/5 |

### 不可复制

品牌、Logo、原文、分类命名顺序、黑色/视觉体系、完整布局、商品图片、FAQ、产品数量、每日更新、QC 透明、trusted、高质量、24h、优惠、汇率、包装费、物流或全球支持声明。

### Oopbuy 差异化落实

- 首页从商品营销改为问题搜索。
- 分类以问题 Topic 为主，商品预览只辅助答案。
- 更新状态绑定 `verified_at/review_due_at/source_status`，不写泛化“daily updated”。
- 跳转只指向已验证 CuriCart canonical productview + UTM；问题页先完整回答。

## 2. InVideoAI.org

### 可观察证据

- 首屏用一个明确 H1 和单一工具 CTA 建立任务入口。
- 下方按 Features → How it works（4 步）→ Examples → Testimonials → FAQ → footer 组织。
- 页面公开写有 independent/unofficial 声明。
- 页面含 free、速度、质量、格式、权利和评价等声明；本项目不采信也不复制。

### 可借鉴部分及对应需求

| 方法 | 解决的 Oopbuy 问题 | 研究证据 |
|---|---|---|
| 工具优先首屏 | 用户想直接搜索 QC、shipping、link、SKU 问题 | Google 四大意图簇；Reddit具体问题 |
| 明确步骤说明 | 将模糊社区建议转为可执行检查表 | Reddit reply consensus/unknown 字段 |
| 示例帮助理解输入 | 展示可搜索的问题表达，不发明平台事实 | Autocomplete query 表达 |
| FAQ/长期内容组织 | 聚合相关追问但避免同义薄页 | 首批问题与 Topic 模型 |

### 不可复制

品牌、Logo、原文、视觉素材、标题、功能承诺、免费/速度/下载/格式/权利声明、示例视频、testimonial、虚构人物、FAQ 答案、完整布局和视觉风格。

### Oopbuy 差异化落实

- 把“生成工具”入口换成“研究问题搜索”，结果是证据状态清晰的问答，而不是生成内容。
- Steps 来自具体问题，Verified/Unknown 分开。
- Examples 使用真实 Google 查询表达，不展示不实操作结果。
- 删除 testimonial/营销指标，增加 Sources & limits、事实复核和相关 CuriCart 商品。

## 3. 综合设计原则

Litbuy 提供“找到东西并继续”的发现路径；InVideoAI 提供“先完成一个任务”的信息层级。Oopbuy 站组合为：

```text
Question search
→ Direct answer
→ Evidence and Unknown
→ Checklist
→ Optional public video demonstration
→ Sources
→ Related questions/products
→ Verified CuriCart canonical click
```

这不是两个参考站的混合皮肤，而是基于 Oopbuy 需求重新定义的研究工具。
