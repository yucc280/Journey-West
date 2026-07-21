export default function Panel({ title, subtitle, className = '', children, toolbar }) {
  return (
    <section className={`panel ${className}`}>
      {(title || toolbar) && (
        <header className="panel-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {toolbar && <div className="panel-toolbar">{toolbar}</div>}
        </header>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}
