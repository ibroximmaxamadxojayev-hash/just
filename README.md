# HelperBox — local preview helper

Quick start

1. Install dependencies (Flask):

```bash
python3 -m pip install flask
```

2. Run the server:

```bash
./run.sh
# or
python3 server.py
```

3. Open `http://127.0.0.1:8000` to see the landing page.

4. Inject the helper into any page by running in the browser console or address bar:

```js
import('http://127.0.0.1:8000/bridge.js')
```

Notes

- Snapshots are saved to `last_host.html` in the project folder.
- `frame.html` displays snapshots and provides a simple chat UI.
