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

export function CuricartBridge({ items, contentSlug, title = "Related product research" }: Props) {
  const products = productItems(items);
  const categories = categoryItems(items);

  if (products.length === 0 && categories.length === 0) return null;

  return (
    <section className="related-product-research" aria-labelledby={`related-products-${contentSlug}`}>
      <div className="related-product-heading">
        <h2 id={`related-products-${contentSlug}`}>{title}</h2>
        <p>Browse related product categories and examples while checking this question.</p>
      </div>

      {products.length > 0 ? (
        <div className="related-product-grid product-grid" data-card-kind="productPreview">
          {products.map((item, index) => {
            if (item.type !== "productPreview") return null;
            const label = `${item.productName} ${item.styleOrSku}`.trim();
            const href = contentSlug === "home" ? item.utmUrl : withUtm(item.canonicalUrl, contentSlug);
            return (
              <a className="research-card product-card" href={href} key={`${item.canonicalUrl}-${item.styleOrSku}`}>
                <span className="research-card-image">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.productName} in ${item.curicartCategory}`}
                    width={480}
                    height={480}
                    sizes="(max-width: 680px) 50vw, (max-width: 980px) 50vw, 25vw"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </span>
                <span className="research-card-meta">{item.curicartCategory}</span>
                <span className="research-card-title">{label}</span>
                <span className="research-card-reason">{item.matchReason}</span>
                <span className="research-card-cta">View example</span>
              </a>
            );
          })}
        </div>
      ) : null}

      {categories.length > 0 ? (
        <div className="related-product-grid category-grid" data-card-kind="categoryLink">
          {categories.map((item) => {
            if (item.type !== "categoryLink") return null;
            const href = contentSlug === "home" ? item.utmUrl : withUtm(item.canonicalUrl, contentSlug);
            return (
              <a className="research-card category-card" href={href} key={item.canonicalUrl}>
                <span className="research-card-meta">Category</span>
                <span className="research-card-title">{item.categoryName}</span>
                <span className="research-card-reason">{item.matchReason}</span>
                <span className="research-card-cta">{item.categoryName.toLowerCase().includes("guide") ? "Explore guide" : "Browse category"}</span>
              </a>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
