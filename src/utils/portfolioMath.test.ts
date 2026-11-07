import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMarqueeOffset,
  calculateMagnetPosition,
  calculateProjectCardMetrics,
  calculateCharScrollRange,
  validateContactForm,
  formatCountUpValue,
  buildHrCandidateSummaryText,
  generateDeterministicQrMatrix,
  calculateDockItemScale,
  shouldShowHrFloatingCard,
  selectGalleryCoverItem,
} from './portfolioMath';

test('calculateMarqueeOffset computes exact scroll offset and opposite row translations', () => {
  const result = calculateMarqueeOffset(500, 300, 800);
  assert.equal(result.offset, 300);
  assert.equal(result.row1TranslateX, 100);
  assert.equal(result.row2TranslateX, -100);
});

test('calculateMagnetPosition activates inside padding and resets outside padding', () => {
  const rect = { left: 100, top: 100, width: 200, height: 200 };
  const active = calculateMagnetPosition(260, 230, rect, 150, 3);
  assert.equal(active.isActive, true);
  assert.equal(active.x, 20);
  assert.equal(active.y, 10);

  const inactive = calculateMagnetPosition(600, 600, rect, 150, 3);
  assert.equal(inactive.isActive, false);
  assert.equal(inactive.x, 0);
  assert.equal(inactive.y, 0);
});

test('calculateProjectCardMetrics computes sticky card targetScale and top offset', () => {
  const card0 = calculateProjectCardMetrics(0, 3);
  assert.equal(card0.targetScale, 0.94);
  assert.equal(card0.topOffsetPx, 0);

  const card1 = calculateProjectCardMetrics(1, 3);
  assert.equal(card1.targetScale, 0.97);
  assert.equal(card1.topOffsetPx, 28);

  const card2 = calculateProjectCardMetrics(2, 3);
  assert.equal(card2.targetScale, 1);
  assert.equal(card2.topOffsetPx, 56);

  // 5 cards assertion
  const five0 = calculateProjectCardMetrics(0, 5);
  assert.equal(five0.targetScale, 0.88);
  assert.equal(five0.topOffsetPx, 0);

  const five4 = calculateProjectCardMetrics(4, 5);
  assert.equal(five4.targetScale, 1);
  assert.equal(five4.topOffsetPx, 112);
});

test('calculateCharScrollRange maps character index to normalized scroll interval', () => {
  const [start, end] = calculateCharScrollRange(5, 10);
  assert.equal(start, 0.5);
  assert.equal(end, 0.6);
});

test('validateContactForm validates required fields and email format', () => {
  const invalid = validateContactForm({
    name: '',
    email: 'invalid-email',
    service: '品牌视觉设计',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Alex Mercer',
    email: 'alex@studio.io',
    service: '品牌视觉设计',
    message: 'Looking for custom brand design for our Q4 launch.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('formatCountUpValue formats eased count-up strings with decimals and suffixes', () => {
  assert.equal(formatCountUpValue(0, 3.65, 2, ''), '0.00');
  assert.equal(formatCountUpValue(1, 3.65, 2, ''), '3.65');
  assert.equal(formatCountUpValue(1, 5000, 0, '+'), '5000+');
  assert.equal(formatCountUpValue(1.5, 30, 0, '+'), '30+');
});

test('buildHrCandidateSummaryText outputs key candidate details for HR quick copy', () => {
  const text = buildHrCandidateSummaryText();
  assert.ok(text.includes('李翰林 (Luis Li)'));
  assert.ok(text.includes('3.65 / 4.0'));
  assert.ok(text.includes('15852182789'));
  assert.ok(text.includes('lihanlin_luis@163.com'));
});

test('generateDeterministicQrMatrix builds a 21x21 matrix with finder corners and center reserve', () => {
  const matrix = generateDeterministicQrMatrix('wechat:15852182789', 21);
  assert.equal(matrix.length, 21);
  assert.equal(matrix[0].length, 21);
  // Top-left finder outer corner and inner core must be true
  assert.equal(matrix[0][0], true);
  assert.equal(matrix[3][3], true);
  // Center module reserved for logo must be false
  assert.equal(matrix[10][10], false);
});

test('calculateDockItemScale computes raised-cosine magnification and lift for magnetic dock', () => {
  // Null mouse resets to 1
  const idle = calculateDockItemScale(null, 200, 1.65, 128);
  assert.equal(idle.scale, 1);
  assert.equal(idle.liftY, 0);

  // Exact center hits maxScale and max upward lift
  const center = calculateDockItemScale(200, 200, 1.65, 128);
  assert.equal(center.scale, 1.65);
  assert.equal(center.liftY, -12);
  assert.equal(center.intensity, 1);

  // Halfway distance (64px of 128px) hits 0.5 intensity -> scale 1.325, lift -6
  const half = calculateDockItemScale(264, 200, 1.65, 128);
  assert.equal(half.scale, 1.325);
  assert.equal(half.liftY, -6);

  // Outside radius resets to 1
  const far = calculateDockItemScale(400, 200, 1.65, 128);
  assert.equal(far.scale, 1);
  assert.equal(far.liftY, 0);
});

test('shouldShowHrFloatingCard hides HR card in Hero and reveals it after scrolling down', () => {
  assert.equal(shouldShowHrFloatingCard(0, 900), false);
  assert.equal(shouldShowHrFloatingCard(200, 900), false);
  assert.equal(shouldShowHrFloatingCard(400, 900), true);
  assert.equal(shouldShowHrFloatingCard(1200, 900), true);
});

test('selectGalleryCoverItem marks selected item as cover and resolves coverUrl', () => {
  const initial = [
    { id: '1', type: 'image' as const, url: 'img1.jpg', isCover: false },
    { id: '2', type: 'image' as const, url: 'img2.jpg', isCover: false },
    { id: '3', type: 'image' as const, url: 'img3.jpg', isCover: true },
  ];
  const res = selectGalleryCoverItem(initial, '1', 'img3.jpg');
  assert.equal(res.coverUrl, 'img1.jpg');
  assert.equal(res.items[0].isCover, true);
  assert.equal(res.items[2].isCover, false);

  const withHtmlCover = [
    ...res.items,
    { id: 'html-1', type: 'html' as const, url: 'blob:1', coverUrl: 'custom-cover.png' },
  ];
  const res2 = selectGalleryCoverItem(withHtmlCover, 'html-1', 'img1.jpg');
  assert.equal(res2.coverUrl, 'custom-cover.png');
  assert.equal(res2.items[3].isCover, true);
  assert.equal(res2.items[0].isCover, false);
});

test('reviveGalleryItems regenerates fresh blob URLs for persisted video Blobs and HTML items', async () => {
  const { reviveGalleryItems } = await import('./mediaStorage');
  const videoBlob = new Blob(['video-bytes'], { type: 'video/mp4' });
  const persisted = [
    {
      id: 'v1',
      type: 'video' as const,
      url: 'blob:stale-expired-url',
      alt: 'Demo Video',
      fileBlob: videoBlob,
      coverUrl: 'data:image/png;base64,abc',
      isCover: true,
    },
    {
      id: 'h1',
      type: 'html' as const,
      url: 'blob:stale-html-url',
      alt: 'Interactive Demo',
      htmlContent: '<h1>Hello</h1>',
      isCover: false,
    },
  ];
  const revived = reviveGalleryItems(persisted, 'default.jpg');
  assert.notEqual(revived[0].url, 'blob:stale-expired-url');
  assert.ok(revived[0].url.startsWith('blob:'));
  assert.equal(revived[0].isCover, true);
  assert.notEqual(revived[1].url, 'blob:stale-html-url');
  assert.ok(revived[1].url.startsWith('blob:'));
});

test('deriveProjectCardCovers and assignGalleryCoverSlot synchronize all 3 project card cover slots', async () => {
  const { deriveProjectCardCovers, assignGalleryCoverSlot } = await import('./portfolioMath');
  const baseCovers = {
    col1Img1: 'base-left-1.jpg',
    col1Img2: 'base-left-2.jpg',
    col2Img: 'base-right-main.jpg',
  };

  const items: Array<{
    id: string;
    type: 'image' | 'video' | 'html';
    url: string;
    isCover?: boolean;
    isCustom?: boolean;
    coverSlot?: 'col1Img1' | 'col1Img2' | 'col2Img';
  }> = [
    { id: '1', type: 'image', url: 'base-left-1.jpg', coverSlot: 'col1Img1' },
    { id: '2', type: 'image', url: 'base-left-2.jpg', coverSlot: 'col1Img2' },
    { id: '3', type: 'image', url: 'base-right-main.jpg', isCover: false },
    { id: 'u1', type: 'image', url: 'uploaded-1.jpg', isCustom: true, isCover: true, coverSlot: 'col2Img' },
  ];

  const derived1 = deriveProjectCardCovers(items, baseCovers, 'TestProject');
  assert.equal(derived1.col2Img, 'uploaded-1.jpg');
  assert.equal(derived1.col1Img1, 'base-left-1.jpg');
  assert.equal(derived1.col1Img2, 'base-left-2.jpg');

  // Assign 'u1' to top-left slot ('col1Img1')
  const reassigned = assignGalleryCoverSlot(items, 'u1', 'col1Img1');
  const derived2 = deriveProjectCardCovers(reassigned, baseCovers, 'TestProject');
  assert.equal(derived2.col1Img1, 'uploaded-1.jpg');
  assert.equal(derived2.col2Img, 'base-right-main.jpg');
});


