import _ from 'lodash';
import alovaInstance, { alovaUploadInstance } from "./alovaInstance";
import { HOST_API } from 'src/config-global';

// Get Select and Radio-Gruop options from API
export function optionsFromAPISourceGetter(srcUrl, params, labelKey, valueKey) {
  return alovaInstance.Get(srcUrl, {
    params,
    localCache: {
      // Set cache mode to memory mode
      mode: 'memory',

      // unit is milliseconds
      // When set to `Infinity`, it means that the data will never expire, and when it is set to 0 or a negative number, it means no caching
      // 1000 is 1 second
      // 1 * 1000 * 60 is 1 minute
      expire: 1 * 1000 * 60 * 5,
    },
    async transformData(rawData, headers) {
      let newOptions = rawData.map((item) => ({
        label: _.get(item, labelKey),
        value: _.get(item, valueKey),
      }));

      return newOptions;
    },
  });
}


export function uploadFileRequest(srcUrl, token, data, strategy = "form-data") {
  if (strategy === "form-data") {
    return alovaUploadInstance.Post(srcUrl,
      // Body
      data,
      // Config
      {
        headers: {
          token,
        },
      }
    )
  }
}

export function register(data) {
  return alovaInstance.Post(`${HOST_API}/mwapi/portal/JordanianUserRegister`, data);
}
