import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import PlaceholderChart from '../components/common/PlaceholderChart';
import ChapterRangeControl from '../components/common/ChapterRangeControl';

export default function CharactersPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="人物维度"
        title="人物关系分析"
        description="观察人物阵营、关系强度与章节活跃变化，默认仅展示主要人物，避免网络过度拥挤。"
      />
      <div className="analysis-layout analysis-layout--characters">
        <aside className="sidebar-stack">
          <Panel title="人物筛选">
            <ChapterRangeControl />
            <div className="control-group">
              <label htmlFor="character-search">搜索人物</label>
              <input id="character-search" type="search" placeholder="如：孙悟空" />
            </div>
            <div className="control-group">
              <label htmlFor="faction">人物阵营</label>
              <select id="faction" defaultValue="all">
                <option value="all">全部阵营</option>
                <option>取经团队</option>
                <option>神佛与天庭</option>
                <option>妖怪</option>
                <option>凡人与其他</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="relation">关系类型</label>
              <select id="relation" defaultValue="all">
                <option value="all">全部关系</option>
                <option>敌对</option>
                <option>帮助或同伴</option>
                <option>师徒、亲属或从属</option>
              </select>
            </div>
          </Panel>
        </aside>

        <div className="visual-stack">
          <Panel title="人物关系网络" subtitle="节点大小表示出场章节数，颜色区分阵营。">
            <PlaceholderChart type="network" title="D3 力导向网络占位区域" description="支持点击、拖拽、搜索定位和直接关系聚焦。" />
          </Panel>
          <Panel title="人物—章节矩阵" subtitle="颜色深度表示人物在对应章节中的活跃度。">
            <PlaceholderChart type="matrix" title="章节热力矩阵占位区域" description="与人物网络双向联动。" />
          </Panel>
        </div>

        <Panel title="人物详情" subtitle="点击人物节点后更新">
          <div className="portrait-placeholder">悟</div>
          <div className="empty-detail empty-detail--compact">
            <h3>尚未选择人物</h3>
            <p>后续显示别名、阵营、出场章节、主要关系和参与事件。</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
