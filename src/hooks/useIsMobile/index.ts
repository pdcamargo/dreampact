const appleIphone = /iPhone/i;
const appleIpod = /iPod/i;
const appleTablet = /iPad/i;
const androidPhone = /\bAndroid(?:.+)Mobile\b/i; // Match 'Android' AND 'Mobile'
const androidTablet = /Android/i;
const amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i; // Match 'Silk' AND 'Mobile'
const amazonTablet = /Silk/i;
const windowsPhone = /Windows Phone/i;
const windowsTablet = /\bWindows(?:.+)ARM\b/i; // Match 'Windows' AND 'ARM'
const otherBlackBerry = /BlackBerry/i;
const otherBlackBerry10 = /BB10/i;
const otherOpera = /Opera Mini/i;
const otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
const otherFirefox = /Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

function createMatch(userAgent: string): (regex: RegExp) => boolean {
  return (regex: RegExp): boolean => regex.test(userAgent);
}

export type isMobileResult = {
  apple: {
    phone: boolean;
    ipod: boolean;
    tablet: boolean;
    device: boolean;
  };
  amazon: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  android: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  windows: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  other: {
    blackberry: boolean;
    blackberry10: boolean;
    opera: boolean;
    firefox: boolean;
    chrome: boolean;
    device: boolean;
  };
  isPhone: boolean;
  isTablet: boolean;
  isAnyMobile: boolean;
};

export function useIsMobile(userAgent?: NavigatorID['userAgent'] | NavigatorID['vendor']): isMobileResult {
  userAgent = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  // Facebook mobile app's integrated browser adds a bunch of strings that
  // match everything. Strip it out if it exists.
  let tmp = userAgent.split('[FBAN');
  if (typeof tmp[1] !== 'undefined') {
    userAgent = tmp[0];
  }

  // Twitter mobile app's integrated browser on iPad adds a "Twitter for
  // iPhone" string. Same probably happens on other tablet platforms.
  // This will confuse detection so strip it out if it exists.
  tmp = userAgent.split('Twitter');
  if (typeof tmp[1] !== 'undefined') {
    userAgent = tmp[0];
  }

  const match = createMatch(userAgent);

  const result: isMobileResult = {
    apple: {
      phone: match(appleIphone) && !match(windowsPhone),
      ipod: match(appleIpod),
      tablet: !match(appleIphone) && match(appleTablet) && !match(windowsPhone),
      device: (match(appleIphone) || match(appleIpod) || match(appleTablet)) && !match(windowsPhone),
    },
    amazon: {
      phone: match(amazonPhone),
      tablet: !match(amazonPhone) && match(amazonTablet),
      device: match(amazonPhone) || match(amazonTablet),
    },
    android: {
      phone: (!match(windowsPhone) && match(amazonPhone)) || (!match(windowsPhone) && match(androidPhone)),
      tablet:
        !match(windowsPhone) &&
        !match(amazonPhone) &&
        !match(androidPhone) &&
        (match(amazonTablet) || match(androidTablet)),
      device:
        (!match(windowsPhone) &&
          (match(amazonPhone) || match(amazonTablet) || match(androidPhone) || match(androidTablet))) ||
        match(/\bokhttp\b/i),
    },
    windows: {
      phone: match(windowsPhone),
      tablet: match(windowsTablet),
      device: match(windowsPhone) || match(windowsTablet),
    },
    other: {
      blackberry: match(otherBlackBerry),
      blackberry10: match(otherBlackBerry10),
      opera: match(otherOpera),
      firefox: match(otherFirefox),
      chrome: match(otherChrome),
      device:
        match(otherBlackBerry) ||
        match(otherBlackBerry10) ||
        match(otherOpera) ||
        match(otherFirefox) ||
        match(otherChrome),
    },
    isAnyMobile: false,
    isPhone: false,
    isTablet: false,
  };

  result.isAnyMobile = result.apple.device || result.android.device || result.windows.device || result.other.device;
  // excludes 'other' devices and ipods, targeting touchscreen phones
  result.isPhone = result.apple.phone || result.android.phone || result.windows.phone;
  result.isTablet = result.apple.tablet || result.android.tablet || result.windows.tablet;

  return result;
}
