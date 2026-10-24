#!/usr/bin/env bash
# Installs the APK on the emulator, launches it, and reports crashes as GitHub annotations.
set -u
adb wait-for-device
adb install -r ThinkTwice.apk || { echo "::error::INSTALL FAILED"; exit 1; }
adb logcat -c
adb shell monkey -p com.thinktwice.app -c android.intent.category.LAUNCHER 1
sleep 40
adb exec-out screencap -p > smoke-screenshot.png
adb logcat -d > logcat.txt
PID=$(adb shell pidof com.thinktwice.app | tr -d '\r')
grep -nE "FATAL EXCEPTION|AndroidRuntime|ReactNativeJS.*(Error|error)|SoLoader|UnsatisfiedLink|Exception" logcat.txt | grep -v "W/" | head -40 | while IFS= read -r l; do echo "::error::LOG ${l:0:900}"; done
if [ -n "$PID" ]; then echo "::notice::APP RUNNING pid=$PID"; else echo "::error::APP NOT RUNNING after launch"; exit 1; fi
