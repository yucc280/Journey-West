import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import PlaceholderChart from '../components/common/PlaceholderChart';
import ChapterRangeControl from '../components/common/ChapterRangeControl';

export default function EventsPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="时间与事件维度"
        title="八十一难时间轴"
        description="按照章节和劫难顺序观察事件分布，并比较事件类型、解决者、解决方式与外援情况。"
      />
      <div className="analysis-layout analysis-layout--events">
        <aside className="sidebar-stack">
          <Panel title="事件筛选">
            <ChapterRangeControl />
            <div className="control-group">
              <label htmlFor="event-type">劫难类型</label>
              <select id="event-type" defaultValue="all">
                <option value="all">全部类型</option>
                <option>妖怪袭击</option>
                <option>道路阻隔</option>
                <option>身份伪装</option>
                <option>师徒矛盾</option>
                <option>神佛考验</option>
              </select>
            </div>
            <label className="checkbox-row">
              <input type="checkbox" />
              仅显示需要外援的事件
            </label>
          </Panel>
        </aside>

        <div className="visual-stack">
          <Panel title="八十一难事件序列" subtitle="颜色表示类型，大小表示持续章节或参与人物数。">
            <PlaceholderChart type="timeline" title="事件时间轴占位区域" description="主要视图：展示81个事件在全书中的时间位置。" />
          </Panel>
          <Panel title="解决路径" subtitle="事件类型 → 主要解决者 → 解决方式">
            <PlaceholderChart type="sankey" title="简化桑基图占位区域" description="作为辅助视图，与时间轴联动过滤。" />
          </Panel>
        </div>

        <Panel title="事件详情" subtitle="点击时间轴节点后更新">
          <div className="empty-detail">
            <span className="detail-number">81</span>
            <h3>选择一项劫难</h3>
            <p>展示章节范围、地点、参与人物、解决方式与是否存在外援。</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
