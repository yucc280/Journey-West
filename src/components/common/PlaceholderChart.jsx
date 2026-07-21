export default function PlaceholderChart({ type = 'chart', title, description }) {
  return (
    <div className={`placeholder-chart placeholder-chart--${type}`}>
      <div className="placeholder-ink" aria-hidden="true" />
      <div className="placeholder-content">
        <span className="placeholder-kicker">VISUALIZATION AREA</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
