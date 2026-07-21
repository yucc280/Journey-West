import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import PlaceholderChart from '../components/common/PlaceholderChart';
import ChapterRangeControl from '../components/common/ChapterRangeControl';

export default function TextAnalysisPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="文本语义维度"
        title="章节词频与情感分析"
        description="比较章节关键词、情感倾向与冲突强度，并从统计结果回溯到原文片段。"
      />
      <div className="text-dashboard">
        <aside className="sidebar-stack">
          <Panel title="文本筛选">
            <ChapterRangeControl />
            <div className="control-group">
              <label htmlFor="metric">趋势指标</label>
              <select id="metric" defaultValue="sentiment">
                <option value="sentiment">情感倾向</option>
                <option value="conflict">冲突强度</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="keyword-type">关键词类型</label>
              <select id="keyword-type" defaultValue="all">
                <option value="all">全部词语</option>
                <option>人物</option>
                <option>战斗</option>
                <option>情绪</option>
                <option>宗教</option>
                <option>地点</option>
              </select>
            </div>
          </Panel>
        </aside>

        <div className="visual-stack">
          <Panel title="章节情感与冲突趋势" subtitle="重要事件可作为曲线注释标记。">
            <PlaceholderChart type="line" title="章节趋势折线图占位区域" description="点击曲线定位章节，并更新原文详情。" />
          </Panel>
          <div className="two-column-grid">
            <Panel title="关键词趋势" subtitle="最多选择3个关键词进行对比。">
              <PlaceholderChart type="line" title="关键词趋势占位区域" description="展示关键词在100回中的变化。" />
            </Panel>
            <Panel title="当前范围高频词" subtitle="使用条形图代替大型词云。">
              <PlaceholderChart type="bars" title="高频词排行占位区域" description="点击词语加入趋势对比。" />
            </Panel>
          </div>
        </div>

        <Panel title="原文回溯" subtitle="点击章节或关键词后更新">
          <div className="quote-placeholder">
            <span>原文</span>
            <p>“点击左侧图表中的章节或关键词后，在这里显示对应回目标题与上下文片段。”</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
