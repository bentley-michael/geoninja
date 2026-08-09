import './brand.css'

export default function BrandShell({ children }) {
  return (
    <div className="brand-shell">
      <header className="brand-header" aria-label="Geography Ninja">
        <img
          className="brand-logo"
          src="/geography-ninja-logo.webp"
          alt="Geography Ninja — Explore, Learn, Master"
        />
      </header>
      <main className="brand-app">{children}</main>
    </div>
  )
}
