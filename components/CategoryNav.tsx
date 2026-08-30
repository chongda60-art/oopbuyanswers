import categories from "@/content/home-categories.json";

type HomeCategory = {
  slug: string;
  name: string;
  canonicalUrl: string;
  utmUrl: string;
  visual: string;
};

const homeCategories = categories as HomeCategory[];

function CategoryGlyph({ visual }: { visual: string }) {
  return (
    <span className={`category-glyph category-glyph-${visual}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function CategoryNav() {
  if (homeCategories.length === 0) return null;

  return (
    <section className="home-section" aria-labelledby="product-categories">
      <div className="section-heading">
        <h2 id="product-categories">Explore product categories</h2>
        <p>Browse related product areas while comparing Oopbuy questions and product examples.</p>
      </div>
      <div className="category-nav-grid">
        {homeCategories.map((category) => (
          <a className="category-nav-card" href={category.utmUrl} key={category.slug}>
            <span className="category-art">
              <CategoryGlyph visual={category.visual} />
            </span>
            <span className="category-name">{category.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
