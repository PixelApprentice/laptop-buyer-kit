"""Automated end-to-end tests for the Laptop Buyer Kit UI using Playwright."""
import threading
import unittest
from tempfile import NamedTemporaryFile
from pathlib import Path

from playwright.sync_api import sync_playwright

from laptop_inspector.db import Database
from laptop_inspector.web.server import create_server

TEST_HOST = "127.0.0.1"
TEST_PORT = 8923


class UITestsPlaywright(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_db = NamedTemporaryFile(suffix=".sqlite3", delete=False)
        cls.temp_db.close()
        cls.db = Database(cls.temp_db.name)

        cls.server = create_server(host=TEST_HOST, port=TEST_PORT, db=cls.db)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()

        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        Path(cls.temp_db.name).unlink(missing_ok=True)

    def setUp(self):
        self.page = self.browser.new_page()

    def tearDown(self):
        self.page.close()

    def test_dashboard_loads_and_has_branding(self):
        self.page.goto(f"http://{TEST_HOST}:{TEST_PORT}")
        self.assertIn("Laptop Buyer Kit", self.page.title())

        # Check navigation tabs exist
        self.assertTrue(self.page.locator(".brand-title").is_visible())
        self.assertTrue(self.page.locator("button[data-tab='tab-inspect']").is_visible())
        self.assertTrue(self.page.locator("button[data-tab='tab-screentest']").is_visible())
        self.assertTrue(self.page.locator("button[data-tab='tab-keyboardtest']").is_visible())
        self.assertTrue(self.page.locator("button[data-tab='tab-history']").is_visible())
        self.assertTrue(self.page.locator("button[data-tab='tab-about']").is_visible())

    def test_inspection_sample_workflow_and_checklist(self):
        self.page.goto(f"http://{TEST_HOST}:{TEST_PORT}")

        # Fill claims
        self.page.fill("#claimModel", "ThinkPad T14 Gen 2")
        self.page.fill("#claimRam", "16")
        self.page.fill("#claimStorage", "512")
        self.page.fill("#operatorNotes", "Playwright automated test inspection")

        # Click Load Synthetic Sample
        self.page.click("#loadSampleBtn")

        # Wait for results to show
        self.page.wait_for_selector("#sessionResults", state="visible")
        self.assertTrue(self.page.locator("#verdictBanner").is_visible())

        # Check findings rendered
        findings = self.page.locator(".finding-card")
        self.assertGreater(findings.count(), 0)

        # Toggle evidence on first card
        first_toggle = self.page.locator(".evidence-toggle").first
        first_toggle.click()
        self.assertTrue(self.page.locator("#ev-0").is_visible())

        # Check coverage table
        self.page.click("button[data-subtab='subtab-coverage']")
        self.page.wait_for_selector("#subtab-coverage", state="visible")
        self.assertGreater(self.page.locator("#coverageTableBody tr").count(), 0)

        # Check manual checklist and click PASS on first item
        self.page.click("button[data-subtab='subtab-manual']")
        self.page.wait_for_selector("#subtab-manual", state="visible")
        pass_btn = self.page.locator(".check-btn[data-val='passed']").first
        pass_btn.click()
        self.page.wait_for_timeout(300)
        self.assertIn("active-pass", pass_btn.get_attribute("class") or "")

    def test_screen_pixel_tester(self):
        self.page.goto(f"http://{TEST_HOST}:{TEST_PORT}")

        self.page.click("button[data-tab='tab-screentest']")
        self.page.wait_for_selector("#tab-screentest", state="visible")

        # Start full-screen test
        self.page.click("#launchScreenTestBtn")
        self.page.wait_for_selector("#screenTestOverlay", state="visible")

        # Click to cycle color
        self.page.click("#screenTestOverlay")
        self.page.wait_for_timeout(100)

        # Exit with ESC
        self.page.keyboard.press("Escape")
        self.page.wait_for_timeout(200)
        self.assertFalse(self.page.locator("#screenTestOverlay").is_visible())

    def test_interactive_keyboard_tester(self):
        self.page.goto(f"http://{TEST_HOST}:{TEST_PORT}")

        self.page.click("button[data-tab='tab-keyboardtest']")
        self.page.wait_for_selector("#tab-keyboardtest", state="visible")

        # Press keys
        self.page.keyboard.press("KeyA")
        self.page.keyboard.press("KeyS")
        self.page.keyboard.press("Space")
        self.page.wait_for_timeout(200)

        # Verify verified count is at least 3
        count_text = self.page.locator("#kbVerifiedCount").inner_text()
        self.assertGreaterEqual(int(count_text), 3)

        # Verify key highlighted
        a_key = self.page.locator("#kb-KeyA")
        self.assertIn("tested", a_key.get_attribute("class") or "")

        # Reset
        self.page.click("#kbResetBtn")
        self.page.wait_for_timeout(100)
        self.assertEqual(self.page.locator("#kbVerifiedCount").inner_text(), "0")

    def test_history_and_about_pages(self):
        self.page.goto(f"http://{TEST_HOST}:{TEST_PORT}")

        # About & Donate tab
        self.page.click("button[data-tab='tab-about']")
        self.page.wait_for_selector("#tab-about", state="visible")
        self.assertTrue(self.page.locator("text=PixelApprentice").first.is_visible())
        self.assertTrue(self.page.locator("a[href*='github.com/sponsors/PixelApprentice']").is_visible())
        self.assertTrue(self.page.locator(".crypto-box").is_visible())

        # History tab
        self.page.click("button[data-tab='tab-history']")
        self.page.wait_for_selector("#tab-history", state="visible")
        self.assertTrue(self.page.locator("#historyTableBody").is_visible())


if __name__ == "__main__":
    unittest.main()
