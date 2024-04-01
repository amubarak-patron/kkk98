import _ from 'lodash';

export default async function fetchOptionsFromApiSource(
  url,
  optionsSourceApiToken,
  optionsSourceApiValueKey,
  optionsSourceApiLabelKey
) {
  const response = await fetch(url, {
    headers: {
      token: `${optionsSourceApiToken}`,
    },
  });
  const data = await response.json();

  if (data) {
    let newOptions = data.map((item) => ({
      label: _.get(item, optionsSourceApiLabelKey),
      value: _.get(item, optionsSourceApiValueKey),
    }));
    return newOptions;
  }

  return [];
}
