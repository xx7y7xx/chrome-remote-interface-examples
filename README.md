# chrome-remote-interface examples

[https://chromedevtools.github.io/devtools-protocol/tot/](https://chromedevtools.github.io/devtools-protocol/tot/)

This repo contains examples implementation of using headless Chrome on linux, which is a common use case for PhantomJS. Contributions are welcome.

### Chrome Version

Headless Chrome is still new and unstable, and the API changes with each new major Chrome version. Our master branch is currently targeting **Chrome 60**–the current stable Chrome version. You may need to modify the script if you wish to target another version.

### Setup on Linux

The setup below was used on a [Vagrant](https://www.vagrantup.com/) running Ubuntu 14 Trusty Tahr. It assumes you've already cloned the repo and run `npm install`.

```sh
# Install Google Chrome
# https://askubuntu.com/questions/79280/how-to-install-chrome-browser-properly-via-command-line
sudo apt-get install libxss1 libappindicator1 libindicator7
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb  # Might show "errors", fixed by next line
sudo apt-get install -f

# Install Node Stable (v8)
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Run Chrome as background process
# https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
# --disable-gpu currently required, see link above
google-chrome --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &

# examples
npm install
npm start
```

### Setup on OSX

Headless Chrome is still highly unstable on OSX (see issue [#1](https://github.com/schnerd/chrome-headless-screenshots/issues/1)). At this point in time I recommend just running chrome & node in docker or vagrant (Vagrantfile pull requests welcome).

If you must run it natively, use the following commands:
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --remote-debugging-port=9222 --disable-gpu
node index.js --url="http://www.eff.org"
```

If screenshots on Mac do not appear to be working, please report an issue on [ChromeDevTools/devtools-protocol](https://github.com/ChromeDevTools/devtools-protocol), [cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface), or chromium itself.
