// رسوم SVG أصلية: أيقونات الواجهة، النباتات، الشخصية، الأشكال، الساعة، الكسور.
const P = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 19.5A2 2 0 0 0 6 21.5h13"/>',
  puzzle: '<path d="M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4z"/>',
  story: '<path d="M2 5c3-1.2 7-1 10 1 3-2 7-2.2 10-1v14c-3-1.2-7-1-10 1-3-2-7-2.2-10-1z"/><path d="M12 6v14"/>',
  bag: '<path d="M7 8a5 5 0 0 1 10 0v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9 14h6M10 3.5V2h4v1.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"/>',
  mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  star: '<path d="M12 2.8l2.8 5.9 6.4.9-4.7 4.5 1.2 6.4L12 17.4l-5.7 3.1 1.2-6.4L2.8 9.6l6.4-.9z"/>',
  next: '<path d="M19 12H5M11 6l-6 6 6 6"/>', prev: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M5 12.5l5 5L20 7"/>', retry: '<path d="M4 12a8 8 0 1 1 3 6.3M4 20v-6h6"/>',
  play: '<path d="M7 4l13 8-13 8z"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  brush: '<path d="M4 20c3 0 4-1 4-3a3 3 0 0 1 3-3l8-8a2 2 0 0 0-3-3l-8 8a3 3 0 0 1-3 3c-2 0-3 1-3 4z"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
  moon: '<path d="M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19L14 10"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
};
export const icon = (n, s = 24, extra = '') => `<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="${n === 'star' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${P[n] || ''}</svg>`;
export const starRow = (n, s = 18) => [1, 2, 3].map(i => `<span class="${i <= n ? 'on' : 'off'}">${icon('star', s)}</span>`).join('');

const leaf = (x, y, rot, sc, fill) => `<path d="M0 0C-11-8-11-24 0-33C11-24 11-8 0 0Z" transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" fill="${fill}" stroke="#0E8F57" stroke-width="2.5"/>`;
export function plant(stage, color = '#E95D8A', size = 120) {
  const g = '#22B573', g2 = '#7ED957', st = (y) => `<path d="M60 92V${y}" stroke="#0E8F57" stroke-width="6" stroke-linecap="round"/>`;
  let body = '';
  if (stage === 0) body = '<path d="M42 96Q60 78 78 96z" fill="#7B4B2A" stroke="#17342C" stroke-width="2.5"/><ellipse cx="60" cy="88" rx="6" ry="4" fill="#C9985F" stroke="#17342C" stroke-width="2"/><path d="M92 54l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#FFC93C" stroke="#B45309" stroke-width="1.5"/>';
  if (stage === 1) body = st(70) + leaf(60, 72, -40, .6, g2) + leaf(60, 72, 40, .6, g);
  if (stage === 2) body = st(52) + leaf(60, 78, -55, .8, g) + leaf(60, 78, 55, .8, g2) + leaf(60, 54, -30, .7, g2) + leaf(60, 54, 30, .7, g);
  if (stage >= 3) body = st(44) + leaf(60, 80, -60, .9, g) + leaf(60, 80, 60, .9, g2) + leaf(60, 62, -40, .75, g2) + leaf(60, 62, 40, .75, g);
  if (stage === 3) body += `<ellipse cx="60" cy="38" rx="9" ry="13" fill="${color}" stroke="#17342C" stroke-width="2.5"/>`;
  if (stage === 4) { body += [0, 72, 144, 216, 288].map(a => `<circle cx="${60 + 14 * Math.sin(a * Math.PI / 180)}" cy="${34 - 14 * Math.cos(a * Math.PI / 180)}" r="10" fill="${color}" stroke="#17342C" stroke-width="2.5"/>`).join('') + '<circle cx="60" cy="34" r="8" fill="#FFC93C" stroke="#17342C" stroke-width="2.5"/>'; }
  return `<svg viewBox="0 0 120 150" width="${size}" height="${size * 1.25}" role="img" aria-hidden="true">${body}<path d="M33 104h54l-7 38H40z" fill="#B9764A" stroke="#17342C" stroke-width="3" stroke-linejoin="round"/><rect x="28" y="94" width="64" height="14" rx="5" fill="#D18A58" stroke="#17342C" stroke-width="3"/></svg>`;
}
// الشخصية المرشدة «برعوم» بعدّة أوضاع
export function mascot(pose = 'happy', size = 160) {
  const eyes = pose === 'sleep' ? '<path d="M84 160q15 10 30 0M142 160q15 10 30 0" fill="none" stroke="#17342C" stroke-width="5" stroke-linecap="round"/>' : pose === 'cheer' ? '<path d="M84 168q15-22 30 0M142 168q15-22 30 0" fill="none" stroke="#17342C" stroke-width="6" stroke-linecap="round"/>' : `<ellipse cx="99" cy="159" rx="16" ry="21" fill="#fff"/><ellipse cx="157" cy="159" rx="16" ry="21" fill="#fff"/><circle cx="${pose === 'think' ? 106 : 103}" cy="${pose === 'think' ? 152 : 163}" r="8" fill="#17342C"/><circle cx="${pose === 'think' ? 160 : 153}" cy="${pose === 'think' ? 152 : 163}" r="8" fill="#17342C"/>`;
  const mouth = pose === 'cheer' ? '<path d="M108 190Q128 220 148 190Z" fill="#17342C"/>' : pose === 'think' ? '<path d="M116 200q12-8 24 0" fill="none" stroke="#0E8F57" stroke-width="5" stroke-linecap="round"/>' : pose === 'sleep' ? '<ellipse cx="128" cy="200" rx="7" ry="5" fill="#0E8F57"/>' : '<path d="M111 192Q128 210 145 192" fill="none" stroke="#0E8F57" stroke-width="5" stroke-linecap="round"/>';
  const arms = pose === 'cheer' || pose === 'wave' ? '<path d="M54 204Q29 195 27 219Q38 239 57 227" fill="#7ED957" stroke="#0E8F57" stroke-width="4" stroke-linecap="round"/><path d="M202 190Q232 150 238 178Q232 204 200 214" fill="#7ED957" stroke="#0E8F57" stroke-width="4" stroke-linecap="round"/>' : '<path d="M54 204Q29 195 27 219Q38 239 57 227M202 204Q227 195 229 219Q218 239 199 227" fill="#7ED957" stroke="#0E8F57" stroke-width="4" stroke-linecap="round"/>';
  const extra = pose === 'think' ? '<text x="196" y="80" font-size="46" font-weight="800" fill="#17342C" font-family="Tahoma,sans-serif">؟</text>' : pose === 'sleep' ? '<text x="196" y="90" font-size="34" font-weight="800" fill="#17342C" font-family="Tahoma,sans-serif">z z</text>' : pose === 'cheer' ? '<path d="M30 70l5 10 11 1-8 8 2 11-10-6-10 6 2-11-8-8 11-1zM220 40l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#FFC93C" stroke="#B45309" stroke-width="2"/>' : '';
  return `<svg viewBox="0 0 256 280" width="${size}" height="${size * 280 / 256}" role="img" aria-label="برعوم"><path d="M124 74C76 82 59 45 77 16C111 17 137 43 124 74Z" fill="#22B573" stroke="#0E8F57" stroke-width="3"/><path d="M134 63C123 27 151 3 183 12C191 45 167 68 134 63Z" fill="#7ED957" stroke="#0E8F57" stroke-width="3"/><path d="M128 67V99" stroke="#0E8F57" stroke-width="9" stroke-linecap="round"/><path d="M49 150C49 103 82 78 128 78S207 103 207 150V207C207 244 177 263 128 263S49 244 49 207Z" fill="#7ED957" stroke="#0E8F57" stroke-width="5"/>${eyes}<ellipse cx="76" cy="187" rx="13" ry="8" fill="#FF9AA2"/><ellipse cx="180" cy="187" rx="13" ry="8" fill="#FF9AA2"/>${mouth}${arms}${extra}</svg>`;
}
const SH = { circle: '<circle cx="50" cy="50" r="38"/>', square: '<rect x="14" y="14" width="72" height="72" rx="4"/>', rect: '<rect x="8" y="26" width="84" height="48" rx="4"/>', triangle: '<path d="M50 12L90 84H10z" stroke-linejoin="round"/>', oval: '<ellipse cx="50" cy="50" rx="42" ry="28"/>', diamond: '<path d="M50 8L90 50L50 92L10 50z" stroke-linejoin="round"/>', star: '<path d="M50 8l11 27 29 3-22 19 7 29-25-15-25 15 7-29L10 38l29-3z" stroke-linejoin="round"/>' };
export const shapeSvg = (name, c = '#2D9CDB', s = 150) => `<svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true"><g fill="${c}" stroke="#17342C" stroke-width="4">${SH[name]}</g></svg>`;
export const swatch = (hex, s = 130) => `<svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="${hex}" stroke="#17342C" stroke-width="4"/></svg>`;
export function clockSvg(h, m, s = 190) {
  const a = (v, max) => v / max * 2 * Math.PI, hand = (ang, len, w) => `<line x1="50" y1="50" x2="${50 + len * Math.sin(ang)}" y2="${50 - len * Math.cos(ang)}" stroke="#17342C" stroke-width="${w}" stroke-linecap="round"/>`;
  const nums = Array.from({ length: 12 }, (_, i) => { const ang = a(i + 1, 12); return `<text x="${50 + 36 * Math.sin(ang)}" y="${50 - 36 * Math.cos(ang) + 3.6}" font-size="10" font-weight="800" text-anchor="middle" fill="#17342C" font-family="Tahoma,Arial,sans-serif">${i + 1}</text>`; }).join('');
  return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" role="img" aria-label="ساعة"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#17342C" stroke-width="4"/>${nums}${hand(a((h % 12) + m / 60, 12), 21, 4.5)}${hand(a(m, 60), 30, 3)}<circle cx="50" cy="50" r="3" fill="#C2410C"/></svg>`;
}
export function pieSvg(parts, filled, s = 150) {
  let out = ''; for (let i = 0; i < parts; i++) { const a0 = i / parts * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / parts * 2 * Math.PI - Math.PI / 2, x0 = 50 + 42 * Math.cos(a0), y0 = 50 + 42 * Math.sin(a0), x1 = 50 + 42 * Math.cos(a1), y1 = 50 + 42 * Math.sin(a1); out += `<path d="M50 50L${x0} ${y0}A42 42 0 0 1 ${x1} ${y1}Z" fill="${i < filled ? '#F2B01E' : '#fff'}" stroke="#17342C" stroke-width="3" stroke-linejoin="round"/>`; }
  return `<svg viewBox="0 0 100 100" width="${s}" height="${s}" role="img" aria-label="كسر">${out}</svg>`;
}
export const avatarHtml = (i, cls = '') => { const [e, bg] = [AV[i % AV.length][0], AV[i % AV.length][1]]; return `<span class="avatar ${cls}" style="background:${bg}" aria-hidden="true">${e}</span>`; };
const AV = [['🦊', '#FFD9B8'], ['🐪', '#F6E3A8'], ['🐢', '#C9EFC6'], ['🦉', '#D8D2F4'], ['🦋', '#CFEAFB'], ['🐝', '#FFEFA6'], ['🐘', '#E1E4EC'], ['🐬', '#BFE6F2']];
export const medal = (ok, name) => `<svg viewBox="0 0 64 80" width="64" height="80" aria-hidden="true"><path d="M20 2h10l6 24H24zM44 2H34l-6 24h12z" fill="${ok ? '#E95D8A' : '#C9D3CE'}"/><circle cx="32" cy="48" r="22" fill="${ok ? '#FFC93C' : '#E4EAE6'}" stroke="#17342C" stroke-width="3"/><path d="M32 36l3.5 7.4 8 1.1-5.8 5.6 1.4 8L32 54.2 24.9 58l1.4-8-5.8-5.6 8-1.1z" fill="${ok ? '#fff' : '#B8C4BE'}" stroke="#17342C" stroke-width="2" stroke-linejoin="round"/></svg>`;
