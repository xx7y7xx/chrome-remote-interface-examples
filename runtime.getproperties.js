const CDP = require('chrome-remote-interface');
const timeout = require('delay');

const log = require('./log');

const url = 'https://www.baidu.com';
const viewportWidth = 1440;
const viewportHeight = 900;

init();

async function init() {
  log('init');
  let client;
  try {
    // Start the Chrome Debugging Protocol
    client = await CDP();

    // Verify version
    const { Browser } = await CDP.Version();
    const browserVersion = Browser.match(/\/(\d+)/)[1];
    if (Number(browserVersion) !== 60) {
      console.warn(`This script requires Chrome 60, however you are using version ${browserVersion}. The script is not guaranteed to work and you may need to modify it.`);
    }

    // Extract used DevTools domains.
    const { DOM, Emulation, Network, Page, Runtime, Log, Console } = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable();
    await Log.enable();
    await Runtime.enable();

    // Print console log
    // Log.entryAdded(function ({ entry: { level, text } }) {
    //   log('[REMOTE]', level, text);
    // });
    Runtime.consoleAPICalled(function ({ type, args }) {
      log('[CONSOLE]', type, args);
    });

    // If user agent override was specified, pass to Network domain
    await Network.setUserAgentOverride({
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/60.0.3112.113 Chrome/60.0.3112.113 Safari/537.36',
    });

    // Set up viewport resolution, etc.
    const deviceMetrics = {
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 0,
      mobile: false,
      fitWindow: false,
    };
    await Emulation.setDeviceMetricsOverride(deviceMetrics);
    await Emulation.setVisibleSize({
      width: viewportWidth,
      height: viewportHeight,
    });

    // Navigate to target page
    log('Navigate to target page:', url)
    await Page.navigate({url});

    // Wait for page load event to take screenshot
    await Page.loadEventFired();

    // Runtime.getProperties()
    // https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#method-getProperties

    let result = null

    result = await Runtime.evaluate({ expression: 'window' });
    log('window : result.result.objectId :', typeof result.result.objectId, result.result.objectId);
    result = await Runtime.getProperties({ objectId: result.result.objectId });
    log('window : result.result.length :', result.result.length);

    client.close();
  } catch (err) {
    if (client) {
      client.close();
    }
    console.error('Exception while taking screenshot:', err);
    process.exit(1);
  }
}
