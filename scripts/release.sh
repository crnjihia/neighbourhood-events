#!/usr/bin/env bash

# This script assumes an Android preview APK has been built by EAS and is available
# as a build artifact. It creates a Git tag, a GitHub release, and uploads the APK.

set -e

VERSION="v0.1.0"
TAG_NAME="$VERSION"

# Create annotated tag
git tag -a "$TAG_NAME" -m "First release $VERSION"

git push origin "$TAG_NAME"

# Create a GitHub release via the GitHub CLI (gh). Ensure gh is installed and authenticated.
# The APK path should be replaced with the actual artifact location.
APK_PATH="./android-builds/preview.apk"

gh release create "$TAG_NAME" --title "Neighbourhood Events $VERSION" --notes "Automated release of the first APK build." "$APK_PATH"
