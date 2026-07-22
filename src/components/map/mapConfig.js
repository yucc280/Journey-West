import L from 'leaflet';

export const TYPE_COLORS = {
  神佛考验: '#c69a44',
  身份伪装: '#7c67a7',
  妖怪袭击: '#b94f47',
  道路阻隔: '#3f8294',
  师徒心性: '#53856b',
  身世劫难: '#b8753f'
};

export const TYPE_EMOJIS = {
  神佛考验: '🏛️',
  身份伪装: '🎭',
  妖怪袭击: '👹',
  道路阻隔: '⛰️',
  师徒心性: '🧘',
  身世劫难: '👶'
};


export function createLocationIcon(group, isSelected) {
  const firstTrial = group.trials[0];
  const color =
    TYPE_COLORS[firstTrial.劫难类型] || '#9aa9a3';

  const emoji =
    TYPE_EMOJIS[firstTrial.劫难类型] || '📍';

  const count = group.trials.length;

  return L.divIcon({
    className: 'trial-marker-wrapper',
    html: `
      <div
        class="trial-marker ${
          isSelected ? 'trial-marker--selected' : ''
        }"
        style="--marker-color: ${color};"
      >
        <span class="trial-marker-emoji">${emoji}</span>

        ${
          count > 1
            ? `
              <span class="trial-marker-count">
                ${count}难
              </span>
            `
            : `
              <span class="trial-marker-number">
                ${firstTrial.编号}
              </span>
            `
        }
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -25]
  });
}