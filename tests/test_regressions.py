"""ASGI integration and frontend/backend matching, without a browser/server."""
import asyncio
import itertools
import json
from pathlib import Path
import re
import subprocess
import sys
import unittest
from urllib.parse import urlencode, urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from app import data_loader
from app.main import app
from app.services.reverse import search


async def request(path, query=""):
    messages = []
    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}
    async def send(message):
        messages.append(message)
    scope = {"type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1",
             "method": "GET", "scheme": "http", "path": path, "raw_path": path.encode(),
             "query_string": query.encode(), "root_path": "", "headers": [],
             "client": ("127.0.0.1", 1), "server": ("localhost", 80)}
    await app(scope, receive, send)
    return (next(m["status"] for m in messages if m["type"] == "http.response.start"),
            b"".join(m.get("body", b"") for m in messages if m["type"] == "http.response.body"))


class Regressions(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        data_loader.init()

    def test_all_63_subject_combinations_match_frontend(self):
        subjects = ["物理", "化学", "生物", "政治", "历史", "地理", "技术"]
        cases = [list(c) for n in range(1, 4) for c in itertools.combinations(subjects, n)]
        html = (ROOT / "static/index.html").read_text()
        function = next(line.strip() for line in html.splitlines() if line.strip().startswith("function majorFits("))
        script = ('const fs=require("fs");const d=JSON.parse(fs.readFileSync(0,"utf8"));let chosen;'
                  + function + ';console.log(JSON.stringify(d.cases.map(c=>{chosen=new Set(c);return d.majors.filter(majorFits).map(m=>m.id)})))')
        payload = {"cases": cases, "majors": [m.model_dump() for m in data_loader.MAJORS.values()]}
        actual = json.loads(subprocess.check_output(["node", "-e", script], input=json.dumps(payload).encode()))
        for case, ids in zip(cases, actual):
            self.assertEqual(ids, [r["major"].id for r in search(case)], case)

    def test_api_carries_all_careers_and_card_metadata(self):
        status, body = asyncio.run(request('/api/majors', urlencode({'subjects': '历史'})))
        self.assertEqual(status, 200)
        rows = json.loads(body)
        law = next(r for r in rows if r['major']['id'] == 'law')
        self.assertEqual({c['name'] for c in law['careers']}, {'律师', '法务专员'})
        for row in rows:
            self.assertTrue({'code', 'published', 'note', 'source_url'} <= row['major'].keys())
            self.assertTrue(row['major']['subject_required'] is not None or row['major'].get('subject_stats'))

    def test_page_assets_resolve_over_http_and_homepage_file_path(self):
        async def check():
            for route in ['/', '/static/index.html', '/subject', '/career-subject']:
                status, body = await request(route)
                self.assertEqual(status, 200, route)
                for asset in re.findall(r'(?:src|href)="([^"]+\.(?:js|css|gif|png))(?:\?[^"#]*)?"', body.decode()):
                    absolute = urlparse(urljoin('http://localhost' + route, asset)).path
                    status, _ = await request(absolute)
                    self.assertEqual(status, 200, (route, asset))
        asyncio.run(check())
        html = (ROOT / 'static/index.html').read_text()
        for asset in re.findall(r'(?:src|href)="([^"]+\.(?:js|css|gif|png))(?:\?[^"#]*)?"', html):
            self.assertTrue((ROOT / 'static' / asset).is_file(), asset)
        for career in data_loader.CAREERS.values():
            icon = ROOT / ('static/assets/career-png/primary-teacher.png' if career.id == 'primary-teacher' else f'static/assets/{career.icon}.svg')
            self.assertTrue(icon.is_file(), career.id)

    def test_api_errors_remain_correct(self):
        self.assertEqual(asyncio.run(request('/api/careers/missing'))[0], 404)
        self.assertEqual(asyncio.run(request('/api/majors', urlencode({'subjects': '物理,物理'})))[0], 422)
        self.assertEqual(json.loads(asyncio.run(request('/api/majors'))[1]), [])

    def test_unverified_major_remains_visible_forward(self):
        status, body = asyncio.run(request('/api/careers/nurse/subject'))
        self.assertEqual(status, 200)
        nursing = json.loads(body)['majors'][0]
        self.assertEqual(nursing['name'], '护理学')
        self.assertIsNone(nursing['subject_required'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
