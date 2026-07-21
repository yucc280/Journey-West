import { useAnalysis } from '../../context/AnalysisContext';

export default function FilterStatusBar() {
  const { chapterRange, selectedCharacter, selectedLocation, selectedEvent } = useAnalysis();
  const tags = [
    `第 ${chapterRange[0]}—${chapterRange[1]} 回`,
    selectedCharacter && `人物：${selectedCharacter}`,
    selectedLocation && `地点：${selectedLocation}`,
    selectedEvent && `事件：${selectedEvent}`,
  ].filter(Boolean);

  return (
    <section className="filter-status" aria-label="当前分析范围">
      <span className="filter-status__label">当前分析范围</span>
      <div className="filter-status__tags">
        {tags.map((tag) => (
          <span className="status-tag" key={tag}>{tag}</span>
        ))}
      </div>
    </section>
  );
}
