"""Optional browser regression suite for the standalone LAMSA LAB.

Needs Playwright, Pillow and a local Chromium browser (test dependencies only). Uses an in-memory
HTML document, so no server, network, external accounts or paid services.
Run: python tests/phase2_smoke.py
"""
from __future__ import annotations

import re
import base64
import shutil
import os
from io import BytesIO
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text()
CSS = (ROOT / 'brand/tokens.css').read_text() + '\n' + (ROOT / 'lab/lab.css').read_text()
SCRIPT = (ROOT / 'lab/lab.js').read_text()


def setup(page, url_query=''):
    html = re.sub(r'<link[^>]*rel="stylesheet"[^>]*>', '', HTML)
    html = re.sub(r'<script defer src="lab/lab\.js"></script>', '', html)
    html = html.replace('</head>', '<style>' + CSS + '</style></head>')
    # Inline existing SVG assets so visual checks stay valid without file/network access.
    for asset in re.findall(r'src="(brand/[^" ]+\.svg)"', html):
        svg_bytes = (ROOT / asset).read_bytes()
        data = 'data:image/svg+xml;base64,' + base64.b64encode(svg_bytes).decode('ascii')
        html = html.replace('src="' + asset + '"', 'src="' + data + '"')
    page.set_content(html, wait_until='domcontentloaded')
    script = SCRIPT
    if url_query:
        script = script.replace("new URLSearchParams(window.location.search)",
                                f"new URLSearchParams({url_query!r})", 1)
    page.add_script_tag(content=script)
    assert page.locator('[data-wall="main"]').count() == 1
    assert page.locator('[data-wall="side"]').count() == 1


def test(browser, width=1440, mobile=False):
    context = browser.new_context(viewport={'width': width, 'height': 860},
                                  is_mobile=mobile, has_touch=mobile,
                                  device_scale_factor=1, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda err: errors.append(str(err)))
    setup(page)
    assert page.get_by_role('heading', name='Un lieu. Mille nuances.').count() == 1
    assert page.locator('[data-harmony]').count() == 4
    assert page.locator('[data-color]').count() == 12
    assert page.locator('#comparisonHandle').is_visible(), 'Comparison handle hidden at 0%'
    assert page.locator('#beforeMask').get_attribute('width') == '0'
    assert page.locator('#comparisonHandle').get_attribute('transform') == 'translate(32 0)'
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Overflow {width}'

    # Exercise the 18 combinations of room / texture / light.
    seen = set()
    for room in ('salon', 'chambre', 'boutique'):
        page.locator(f'[data-room="{room}"]').click()
        assert page.locator(f'[data-room="{room}"]').get_attribute('aria-pressed') == 'true'
        for finish in ('mat', 'velours', 'mineral'):
            page.locator(f'[data-finish="{finish}"]').click()
            for lighting in ('jour', 'soir'):
                page.locator(f'[data-light="{lighting}"]').click()
                assert page.locator(f'[data-finish="{finish}"]').get_attribute('aria-pressed') == 'true'
                assert page.locator(f'[data-light="{lighting}"]').get_attribute('aria-pressed') == 'true'
                data = page.locator('#roomScene').inner_html()
                seen.add((room, finish, lighting))
                if finish == 'mineral': assert 'lamsa-mineral' in data
                assert page.locator('[data-wall]').count() == 2
    assert len(seen) == 18

    # Pair and individual wall color, keyboard focus, comparison slider.
    page.locator('[data-room="salon"]').click()
    page.locator('[data-harmony="atelier"]').click()
    assert page.locator('[data-harmony="atelier"]').get_attribute('aria-pressed') == 'true'
    assert page.locator('[data-wall="main"]').get_attribute('fill') == '#355761'
    assert page.locator('[data-wall="side"]').get_attribute('fill') == '#C6785B'
    page.locator('[data-wall-button="side"]').click()
    page.locator('[data-color="#A5B48A"]').click()
    assert page.locator('[data-wall="side"]').get_attribute('fill') == '#A5B48A'
    assert page.locator('#visualSideColor').inner_text() == '#A5B48A'
    assert page.locator('[data-wall="main"]').get_attribute('fill') == '#355761'
    page.locator('[data-wall="side"]').focus()
    page.keyboard.press('Enter')
    assert page.locator('[data-wall="side"]').get_attribute('aria-pressed') == 'true'
    page.locator('#compareRange').fill('63')
    assert page.locator('#beforeMask').get_attribute('width') == '604.8'
    assert '63%' in page.locator('#compareOutput').inner_text()
    page.locator('#compareRange').focus()
    page.keyboard.press('Home')
    assert page.locator('#compareRange').input_value() == '0'
    page.keyboard.press('End')
    assert page.locator('#compareRange').input_value() == '100'
    assert page.locator('#comparisonHandle').is_visible(), 'Comparison handle hidden at 100%'

    # Can drag the split directly from the initial 0% position.
    page.locator('#compareRange').fill('0')
    handle = page.locator('#comparisonHitArea')
    handle.scroll_into_view_if_needed()
    bounds = handle.bounding_box()
    scene = page.locator('#roomScene').bounding_box()
    assert bounds and scene
    start_x = bounds['x'] + bounds['width'] / 2
    start_y = bounds['y'] + bounds['height'] / 2
    page.mouse.move(start_x, start_y)
    page.mouse.down()
    page.mouse.move(scene['x'] + scene['width'] * .4, start_y, steps=6)
    page.mouse.up()
    assert int(page.locator('#compareRange').input_value()) >= 35, 'Seam drag failed'

    # Copy (or fallback) should preserve all room values and finish; reset restores defaults.
    page.locator('[data-finish="mineral"]').click()
    page.locator('[data-light="soir"]').click()
    page.evaluate('''() => {window.__shared = ''; Object.defineProperty(navigator, 'clipboard', {
        configurable: true, value:{writeText: async text => {window.__shared = text}}});}''')
    page.locator('#shareBtn').click()
    link = page.evaluate('window.__shared')
    assert 'salon_side=%23A5B48A' in link
    assert 'finition=mineral' in link
    assert 'lumiere=soir' in link
    # Restore from the actual encoded params via the same JS initialization.
    from urllib.parse import urlsplit
    query = '?' + urlsplit(link).query
    second = context.new_page()
    setup(second, query)
    assert second.locator('[data-wall="side"]').get_attribute('fill') == '#A5B48A'
    assert second.locator('[data-finish="mineral"]').get_attribute('aria-pressed') == 'true'
    assert second.locator('[data-light="soir"]').get_attribute('aria-pressed') == 'true'
    second.close()

    # Export must contain selected colors and no comparison handle/selection pin.
    page.evaluate('''() => {const original = XMLSerializer.prototype.serializeToString;
      XMLSerializer.prototype.serializeToString = function(...args) {
        const xml=original.apply(this,args); window.__lastExportXML=xml; return xml; };}''')
    with page.expect_download() as download_info:
        page.locator('#downloadBtn').click()
    download = download_info.value
    xml = page.evaluate('window.__lastExportXML')
    assert 'comparisonHandle' not in xml
    assert 'surface-indicator' not in xml
    assert download.suggested_filename == 'LAMSA-salon-mineral.png', download.suggested_filename
    data = Path(download.path()).read_bytes()
    with Image.open(BytesIO(data)) as img:
        assert img.size == (1440, 975), img.size
        assert img.format == 'PNG'
        px = img.convert('RGB')
        # Footer is branded dark ink; wall colors appear as two swatches.
        assert px.getpixel((8, 940)) == (29, 49, 53)
        assert px.getpixel((885, 928)) == (53, 87, 97)
        assert px.getpixel((1145, 928)) == (165, 180, 138)
    if mobile:
        page.locator('[data-wall-button="main"]').click()
        page.locator('#roomScene').scroll_into_view_if_needed()
        bounds=page.locator('#roomScene').bounding_box()
        # Tap a visible part of the left wall, away from the comparison handle.
        page.touchscreen.tap(bounds['x'] + bounds['width']*116/960, bounds['y'] + bounds['height']*176/650)
        assert page.locator('[data-wall="side"]').get_attribute('aria-pressed') == 'true', 'Touch wall selection failed'
    page.locator('#resetBtn').click()
    assert page.locator('#selectedColorCode').inner_text() == '#C6785B'
    assert page.locator('#compareRange').input_value() == '0'
    assert page.locator('[data-finish="mat"]').get_attribute('aria-pressed') == 'true'
    assert page.locator('#comparisonHandle').is_visible()

    if width in (390, 1440):
        page.screenshot(path=str(ROOT / 'tests' / f'phase2-final-{width}.png'), full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Final overflow {width}'
    assert not errors, errors
    context.close()
    print(f'PASS width={width} mobile={mobile}: 18 scenes, colors, harmony, keyboard, drag, link, PNG, reset')


if __name__ == '__main__':
    with sync_playwright() as p:
        chromium = os.environ.get('LAMSA_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = p.chromium.launch(**({'executable_path': chromium} if chromium else {}),
                                    headless=True, args=['--no-sandbox'])
        for w, touch in ((320, True), (390, True), (768, True), (1024, False), (1440, False)):
            test(browser, w, touch)
        browser.close()
    print('Phase 02 browser checks completed.')
