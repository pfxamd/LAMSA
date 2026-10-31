"""Regression for LAB comparison UX (local Playwright + Chromium; no production dependency)."""
from __future__ import annotations
import base64
import os
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

def setup(page):
    html = (ROOT / "lab/index.html").read_text()
    styles = "\n".join((ROOT / x).read_text() for x in (
        "brand/tokens.css", "lab/lab.css", "assets/site.css", "lab/ux.css"))
    html = re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>', "", html)
    html = re.sub(r'<script\s+defer\s+src="[^"]+"></script>', "", html)
    html = html.replace("</head>", "<style>" + styles + "</style></head>")
    for image in re.findall(r'src="(\.\./brand/[^"]+\.svg)"', html):
        data = base64.b64encode((ROOT / image.removeprefix("../")).read_bytes()).decode()
        html = html.replace('src="' + image + '"', 'src="data:image/svg+xml;base64,' + data + '"')
    page.set_content(html, wait_until="domcontentloaded")
    page.add_script_tag(content=(ROOT / "assets/site.js").read_text())
    page.add_script_tag(content=(ROOT / "lab/lab.js").read_text())

def check(browser, width):
    ctx = browser.new_context(viewport={"width":width,"height":900},accept_downloads=True)
    page = ctx.new_page()
    errors = []
    page.on("pageerror",lambda err:errors.append(str(err)))
    setup(page)
    assert page.locator("[data-color]").count() == 12
    assert page.locator("[data-compare-preset]").count() == 3
    assert page.locator("#beforeMask").get_attribute("width") == "0"
    page.locator('[data-compare-preset="50"]').click()
    assert page.locator("#compareRange").input_value() == "50"
    assert page.locator("#beforeMask").get_attribute("width") == "480"
    page.locator('[data-compare-preset="100"]').click()
    assert page.locator(".scene-frame").get_attribute("data-compare") == "before"
    page.locator('[data-compare-preset="0"]').click()
    assert page.locator(".scene-frame").get_attribute("data-compare") == "after"
    page.locator("#compareRange").focus()
    page.keyboard.press("End")
    assert page.locator("#compareRange").input_value() == "100"
    page.keyboard.press("Home")
    assert page.locator("#compareRange").input_value() == "0"
    # CSS handle always has usable dimensions, even on a mobile-width SVG.
    page.locator('[data-compare-preset="50"]').click()
    grip = page.locator("#sceneScrubHandle")
    grip.scroll_into_view_if_needed()
    area = page.locator("#roomScene").bounding_box()
    rect = grip.bounding_box()
    assert rect and area and rect["width"] >= 44 and rect["height"] >= 54
    y = rect["y"] + rect["height"]/2
    page.mouse.move(rect["x"]+rect["width"]/2,y)
    page.mouse.down()
    page.mouse.move(area["x"]+area["width"]*.78,y,steps=7)
    page.mouse.up()
    assert int(page.locator("#compareRange").input_value()) >= 70
    page.locator('.control-panel [data-wall-button="side"]').click()
    page.locator('[data-color="#A5B48A"]').click()
    assert page.locator('[data-wall="side"]').get_attribute("fill") == "#A5B48A"
    for room in ("salon","chambre","boutique"):
        page.locator(f'[data-room="{room}"]').click()
        assert page.locator('[data-wall]').count() == 2
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    assert not errors, errors
    ctx.close()
    print(f"PASS LAB UI {width}px")

if __name__ == "__main__":
    with sync_playwright() as p:
        executable = os.environ.get("LAMSA_CHROMIUM") or shutil.which("chromium") or shutil.which("google-chrome")
        browser = p.chromium.launch(**({"executable_path":executable} if executable else {}),
            headless=True,args=["--no-sandbox"])
        for width in (320,390,820,1024,1440):
            check(browser,width)
        browser.close()
