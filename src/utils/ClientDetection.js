
export default class ClientDetection {
  constructor() {

  }
  static isMobile(userAgent) {
    let isMobile;
    if(/mobile/i.test(userAgent)) {
      isMobile = true;
    } else {
      isMobile = false;
    }
    return isMobile;
  }
}
