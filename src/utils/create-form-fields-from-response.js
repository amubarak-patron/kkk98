/* eslint-disable default-case */
import { HOST_API } from "src/config-global";

export default function createFormFieldsFromResponse(additionalPersonInfo, location = 118, grid = 4) {
  console.log("hello")
  const getFieldProps = (param_code) => {
    switch (param_code) {
      case '001':
        return {
          type: 'input',
          typeValue: 'string',
          inputType: 'text',
        };
      case '002':
        return {
          type: 'input',
          typeValue: 'string',
          inputType: 'text',
          multiline: true,
          // rows: 4,
        };
      case '003':
        return {
          type: 'upload',
          typeValue: 'array',
          value: [],
          uploadStrategy: 'tempId',
          destinationApi: `${HOST_API}/UploadAttachment`,
          destinationApiToken: '',
          destinationExtraArgs: {
            Location: location,
          },
          maxFileSize: '2048',
          allowedExtensions: [
            "png",
            "jpg",
            "bmp",
            "heif",
            "jpeg",
            "pdf",
          ],
          responseFileNameKey: 'attachment.attachmentID',
        };

      case '004':
        return {
          type: 'upload',
          typeValue: 'array',
          value: [],
          uploadStrategy: 'tempId',
          destinationApi: `${HOST_API}/UploadAttachment`,
          destinationApiToken: '',
          destinationExtraArgs: {
            Location: location,
          },
          multiple: true,
          maximimFiles: 5,
          maxFileSize: '2048',
          allowedExtensions: [
            "png",
            "jpg",
            "bmp",
            "heif",
            "jpeg",
            "pdf",
          ],
          responseFileNameKey: 'attachment.attachmentID',
        };


      // case '003':
      //   return {
      //     type: 'upload',
      //     typeValue: 'array',
      //     value: [],
      //     uploadStrategy: 'form-data',
      //     destinationApi: `${HOST_API}/UploadAttachment`,
      //     destinationApiToken: '',
      //     destinationExtraArgs: {
      //       Location: location,
      //     },
      //     maxFileSize: '2048',
      //     allowedExtensions: [
      //       "png",
      //       "jpg",
      //       "bmp",
      //       "heif",
      //       "jpeg",
      //       "pdf",
      //     ],
      //     responseFileNameKey: 'attachmentID',
      //   };

      // case '004':
      //   return {
      //     type: 'upload',
      //     typeValue: 'array',
      //     value: [],
      //     uploadStrategy: 'form-data',
      //     destinationApi: `${HOST_API}/UploadAttachment`,
      //     destinationApiToken: '',
      //     destinationExtraArgs: {
      //       Location: location,
      //     },
      //     multiple: true,
      //     maximimFiles: 5,
      //     maxFileSize: '2048',
      //     allowedExtensions: [
      //       "png",
      //       "jpg",
      //       "bmp",
      //       "heif",
      //       "jpeg",
      //       "pdf",
      //     ],
      //     responseFileNameKey: 'attachmentID',
      //   };

    }
  };

  const formFields = additionalPersonInfo.map((field) => {
    const { param_GUID, param_name, param_code, param_value } = field;
    const fieldValidations = [];

    if (!field.optional) {
      // 003, 004 means array of file names
      // when an array field is required, we put a length validation
      if (['003', '004'].includes(field.param_code)) {
        fieldValidations.push({ type: 'min', value: 1, message: 'required' });
      } else {
        // when an a string/number/..etc field is required, we put required validation
        fieldValidations.push({ type: 'required', message: 'required' });
      }
    }
    const formField = {
      fieldVariable: param_GUID,
      label: param_name,
      value: param_value,
      placeholder: param_name,
      validations: fieldValidations,
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: grid,
        },
      ],
      ...getFieldProps(param_code),

    };
    return formField;
  });

  return formFields;
}
