import { parsePhoneNumberFromString } from 'libphonenumber-js';
export function validatePhoneNumber(phoneNumber) {
  if (phoneNumber && phoneNumber.length) {
    try {
      const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        return true;
      }
      return false;
    } catch (error) {
      console.log('phone error', error);
    }
  }
  return false;
}
