#!/bin/bash
# Builds "Trend Radar.app" (satellite + flying money icon) in ~/Applications. Drag it to the Dock.
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
APP="$HOME/Applications/Trend Radar.app"
RUN="$HOME/.trend-radar"
mkdir -p "$RUN" "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$SRC"/scanner.py "$SRC"/dashboard.py "$SRC"/dashboard.html "$RUN"/

cat > "$APP/Contents/MacOS/TrendRadar" <<'SH'
#!/bin/bash
RUN="$HOME/.trend-radar"
if ! curl -s -o /dev/null --max-time 2 http://127.0.0.1:8765/; then
  cd "$RUN" && nohup /usr/bin/env python3 dashboard.py >> "$RUN/server.log" 2>&1 &
  for i in $(seq 1 20); do curl -s -o /dev/null --max-time 1 http://127.0.0.1:8765/ && break; sleep 0.5; done
fi
open http://127.0.0.1:8765/
SH
chmod +x "$APP/Contents/MacOS/TrendRadar"

cat > "$APP/Contents/Info.plist" <<'PL'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleName</key><string>Trend Radar</string>
<key>CFBundleDisplayName</key><string>Trend Radar</string>
<key>CFBundleIdentifier</key><string>local.trendradar</string>
<key>CFBundleExecutable</key><string>TrendRadar</string>
<key>CFBundleIconFile</key><string>icon</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleVersion</key><string>1</string>
<key>LSUIElement</key><false/>
</dict></plist>
PL

cp "$SRC/icon.icns" "$APP/Contents/Resources/icon.icns"
touch "$APP"
echo "Built: $APP"
