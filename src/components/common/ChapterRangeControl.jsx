import { useAnalysis } from '../../context/AnalysisContext';

export default function ChapterRangeControl() {
  const { chapterRange, setChapterRange } = useAnalysis();

  const updateStart = (event) => {
    const start = Number(event.target.value);
    setChapterRange([Math.min(start, chapterRange[1]), chapterRange[1]]);
  };

  const updateEnd = (event) => {
    const end = Number(event.target.value);
    setChapterRange([chapterRange[0], Math.max(end, chapterRange[0])]);
  };

  return (
    <div className="range-control">
      <div className="range-control__header">
        <span>章节范围</span>
        <strong>{chapterRange[0]}—{chapterRange[1]} 回</strong>
      </div>
      <label>
        起始章节
        <input type="range" min="1" max="100" value={chapterRange[0]} onChange={updateStart} />
      </label>
      <label>
        结束章节
        <input type="range" min="1" max="100" value={chapterRange[1]} onChange={updateEnd} />
      </label>
    </div>
  );
}
