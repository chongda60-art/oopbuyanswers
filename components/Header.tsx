import Link from "next/link";
import { siteConfig } from "@/lib/config";

const links = [
  ["/questions", "Questions"],
  ["/topics", "Topics"],
  ["/#product-categories", "Product Categories"],
  ["/about", "About"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">{siteConfig.brand}</Link>
        <nav aria-label="Primary navigation">
          {links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
          <Link className="nav-button" href="/questions">Browse questions</Link>
        </nav>
      </div>
    </header>
  );
}
