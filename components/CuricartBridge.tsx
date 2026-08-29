import Image from "next/image";
import type { CuricartBridgeItem } from "@/lib/content";
import { isRenderableBridgeItem, withUtm } from "@/lib/curicart-bridge";

type Props = {
  items: CuricartBridgeItem[];
  contentSlug: string;
  title?: string;
};

const productItems = (items: CuricartBridgeItem[]) =>
  items.filter((item) => item.type === "productPreview" && isRenderableBridgeItem(item)).slice(0, 5);

const categoryItems = (items: CuricartBridgeItem[]) =>
  items.filter((item) => item.type === "categoryLink" && isRenderableBridgeItem(item));

export function CuricartBridge({ items, contentSlug, title = "Related CuriCart research exits" }: Props) {
  const products = productItems(items);
  const categories = categoryItems(items);

  if (products.length === 0 && categories.length === 0) return null;

  return (
    <section className="curicart-bridge" aria-labelledby={`curicart-bridge-${contentSlug}`}>
      <div className="bridge-heading">
        <p className="eyebrow">CuriCart bridge</p>
        <h2 id={`curicart-bridge-${contentSlug}`}>{title}</h2>
        <p>
          These links leave Oopbuy Answers and open canonical CuriCart pages with referral UTM.
          Product cards render only when approved CuriCart data is complete.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="bridge-grid product-grid" data-bridge-kind="productPreview">
          {products.map((item, index) => {
            if (item.type !== "productPreview") return null;
            const label = `${item.productName} ${item.styleOrSku}`.trim();
            const href = contentSlug === "home" ? item.utmUrl : withUtm(item.canonicalUrl, contentSlug);
            return (
              <a className="bridge-card product-card" href={href} key={`${item.canonicalUrl}-${item.styleOrSku}`}>
                <span className="bridge-image">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.productName} in ${item.curicartCategory}`}
                    width={480}
                    height={480}
                    sizes="(max-width: 680px) 50vw, (max-width: 980px) 50vw, 25vw"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </span>
                <span className="bridge-meta">{item.curicartCategory}</span>
                <span className="bridge-title">{label}</span>
                <span className="bridge-reason">{item.matchReason}</span>
                <span className="bridge-cta">Open on CuriCart</span>
              </a>
            );
          })}
        </div>
      ) : null}

      {categories.length > 0 ? (
        <div className="bridge-grid category-grid" data-bridge-kind="categoryLink">
          {categories.map((item) => {
            if (item.type !== "categoryLink") return null;
            const href = contentSlug === "home" ? item.utmUrl : withUtm(item.canonicalUrl, contentSlug);
            return (
              <a className="bridge-card category-card" href={href} key={item.canonicalUrl}>
                <span className="bridge-meta">CuriCart category</span>
                <span className="bridge-title">{item.categoryName}</span>
                <span className="bridge-reason">{item.matchReason}</span>
                <span className="bridge-cta">Open category on CuriCart</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
