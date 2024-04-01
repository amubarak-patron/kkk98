import { createAlova } from "alova";
import GlobalFetch from "alova/GlobalFetch";
import ReactHook from "alova/react";

const handleResponded = async (response, config) => {
  // if (response.code !== 200) {
  //   // When an error is thrown here, it will enter the request failure interceptor
  //   throw new Error(json.message);
  // }
  const json = await response.json();
  // console.log(json)
  return {
    ...json,
    isError: !!!response.ok
  };
}

const alovaInstance = createAlova({
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  beforeRequest(method) {
    method.config.headers['Content-Type'] = method.config.headers['Content-Type'] ? method.config.headers['Content-Type'] : 'application/json'
  },
  async responsed(response, config) {
    return await handleResponded(response, config)
  },
});

export const alovaUploadInstance = createAlova({
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  async responsed(response, config) {
    return await handleResponded(response, config)
  },
});

export default alovaInstance;
