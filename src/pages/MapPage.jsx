import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import PlaceholderChart from '../components/common/PlaceholderChart';
import ChapterRangeControl from '../components/common/ChapterRangeControl';

export default function MapPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="空间维度"
        title="西行地理路线"
        description="以叙事路线展示地点顺序、地点类型与关联事件，不将虚构地点解释为精确现实坐标。"
      />
      <div className="analysis-layout analysis-layout--map">
        <aside className="sidebar-stack">
          <Panel title="路线筛选" subtitle="页面局部条件">
            <ChapterRangeControl />
            <div className="control-group">
              <label htmlFor="location-type">地点类型</label>
              <select id="location-type" defaultValue="all">
                <option value="all">全部地点</option>
                <option>城镇与国家</option>
                <option>山岭</option>
                <option>河流与水域</option>
                <option>洞府</option>
                <option>神话空间</option>
              </select>
            </div>
            <button type="button" className="primary-button">播放西行路线</button>
          </Panel>
          <div className="note-card">
            <strong>地图说明</strong>
            <p>本页主要表达小说地点的叙事顺序，位置仅作可视分析使用。</p>
          </div>
        </aside>

        <Panel title="取经路线图" subtitle="节点大小表示关联事件数量，形状区分地点类型。" className="main-visual-panel">
          <PlaceholderChart type="map" title="叙事路线地图占位区域" description="后续可使用 D3 + SVG 绘制节点路线与播放动画。" />
        </Panel>

        <Panel title="地点详情" subtitle="点击地图节点后更新">
          <div className="empty-detail">
            <span className="detail-number">—</span>
            <h3>尚未选择地点</h3>
            <p>选择地图中的地点后，在此显示章节、事件、人物和故事摘要。</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
