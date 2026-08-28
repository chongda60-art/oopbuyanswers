import Link from "next/link";
import { siteConfig } from "@/lib/config";

const links = [
  ["/questions", "Questions"],
  ["/topics", "Topics"],
  ["/sources", "Sources"],
  ["/about", "About"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">{siteConfig.brand}</Link>
        <nav aria-label="Primary navigation">
          {links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
