import { toDataURL } from 'qrcode';

const OPTIONS = {
  width: 400,
  margin: 2,
};

export const generateQRCode = (value, optionsOverride) => {
  let qrValue = '';

  toDataURL(
    value,
    {
      ...OPTIONS,
      ...optionsOverride,
    },
    (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      qrValue = url;
    }
  );

  return qrValue;
};
