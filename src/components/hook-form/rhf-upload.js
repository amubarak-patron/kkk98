/* eslint-disable jsx-a11y/iframe-has-title */
import PropTypes from 'prop-types';
import { useFormContext, Controller, useController } from 'react-hook-form';
import { useRequest } from 'alova';
// @mui
import FormHelperText from '@mui/material/FormHelperText';
// utils
import wrapRequwest from 'src/utils/wrapRequest';
import { uploadFileRequest } from 'src/utils/api';
//
import { UploadAvatar, Upload, UploadBox, UploadField } from '../upload';
import { useEffect, useState } from 'react';
import { useLocales } from 'src/locales';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import uuidv4 from 'src/utils/uuidv4';
import { idText } from 'typescript';
import _ from 'lodash';
import SvgColor from '../svg-color';


// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, sx, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox
          files={field.value}
          error={!!error}
          sx={{
            ...sx,
          }}
          {...other}
        />
      )}
    />
  );
}

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}

// ----------------------------------------------------------------------
export function RHFUploadField({
  name,
  sx,
  uploadStrategy,
  destinationApi,
  destinationApiToken,
  destinationExtraArgs,
  responseFileNameKey,
  allowedExtensions,
  minFileSize,
  maxFileSize,
  multiple,
  maximimFiles,
  ...other
}) {
  const allowedExtensionsList = allowedExtensions.slice();
  const { t } = useLocales();
  const { control, getValues, setValue, setError, clearErrors } = useFormContext();
  const [eFileId, setEFileId] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [viewFile, setViewFile] = useState(null)


  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const [loading, setLoading] = useState(false);
  // const {
  //   loading,
  //   send,
  //   data: options,
  // } = useRequest(
  //   (data) => uploadFileRequest(destinationApi, destinationApiToken, data, uploadStrategy), {
  //   immediate: false,
  // });

  const getSizeInMB = (size) => {
    return parseFloat(Number(size) / 1024).toFixed(2);
  };

  const parseExtension = (fileName) => {
    return fileName?.split('.')?.pop();
    // if (extension.includes("/")) {
    //   return extension.split("/")[1]
    // } else {
    //   return extension
    // }
  };
  const uploadFile = async (file) => {
    setCurrentFiles([])
    const fileSizeKiloBytes = file.size / 1024;

    let error = '';
    let fileExt = parseExtension(file.name);
    if (allowedExtensionsList?.length > 0 && !allowedExtensionsList?.includes(fileExt)) {
      error = t('extension_not_allowed', {
        allowed_extensions: allowedExtensionsList
          .slice()
          // .map(ext => {
          //   return parseExtension(ext)
          // })
          .join(', '),
        extension: fileExt,
      });
    } else if (minFileSize && fileSizeKiloBytes < Number(minFileSize)) {
      error = t('file_size_cant_be_less_than', {
        size: getSizeInMB(minFileSize),
        unit: t('megabyte'),
      });
    } else if (maxFileSize && fileSizeKiloBytes > Number(maxFileSize)) {
      error = t('file_size_cant_be_larger_than', {
        size: getSizeInMB(maxFileSize),
        unit: t('megabyte'),
      });
    } else {

      setCurrentFiles([file])
    }

    if (error) {
      setError(name, {
        message: error,
      });
      return;
    } else {
      clearErrors(name);
    }

    if (uploadStrategy === 'form-data') {
      const formData = new FormData();

      // Append File
      formData.append('File', file);

      // Append Extra Args
      if (Object.keys(destinationExtraArgs).length > 0) {
        Object.keys(destinationExtraArgs).forEach((key) => {
          formData.append(key, destinationExtraArgs[key]);
        });
      }

      try {
        const response = await axiosInstance.post(destinationApi, formData, {
          headers: {
            token: destinationApiToken,
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data.data[responseFileNameKey];
      } catch (error) {
        console.log(error);
      }
    } else if (uploadStrategy === 'tempId') {

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });


      try {
        const response = await axiosInstance.post(destinationApi, {
          File: base64.toString().split("base64,").pop(),
          eFileId: eFileId,
          fileName: file.name,
          contentLength: file.size,
          location: destinationExtraArgs.Location
        }, {
          headers: {
            token: destinationApiToken,
          },
        });

        if (!eFileId) {
          setEFileId(response?.data?.data?.eFileId)
        }

        const randomFileId = uuidv4().toString()

        return _.get(response.data.data, responseFileNameKey)?.toString() || randomFileId;
      } catch (error) {
        console.log(error);
      }
    }
  };


  const reader = new FileReader();

  const uploadFiles = async (files) => {

    // check if files count is more than maximum allowed files

    // if files count is more than maximum allowed files
    // or if old files count + new files count is more than maximum allowed files
    if (
      (maximimFiles && files.length > maximimFiles) ||
      (field.value && field.value.length + files.length > maximimFiles)
    ) {
      setError(name, {
        message: t('maximum_files_allowed', {
          max: maximimFiles,
        }),
      });
      return;
    } else {
      clearErrors(name);

    }

    try {
      let uploadedFilesIds = [];


      setLoading(true);

      for (let i = 0; i < files.length; i++) {

        const file = files[i];
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          const base64Data = reader.result.split(',')[1];
          file.base64 = base64Data
        };
        const uploadedFileId = await uploadFile(file);

        if (uploadedFileId) {
          uploadedFilesIds.push(uploadedFileId);
          file.id = uploadedFilesIds[0]
          const updatedFiles = !multiple ? [file] : [...currentFiles, file];

          setCurrentFiles(updatedFiles);

          // (!multiple ? setCurrentFiles([file]) : setCurrentFiles([...currentFiles, file]))

        }
      }

      // console.log('uploadedFilesIds', uploadedFilesIds);

      setLoading(false);

      // field.onChange(response.data.data[responseFileNameKey]);
      // setValue(name + '_filename', file.name);

      if (uploadedFilesIds.length > 0) {
        if (!multiple) {
          setValue(name + '_filename', files[0]?.name?.toString());
          setValue(name + '_base64', files[0].base64);
          setValue(name + '_type', files[0].type);
          field.onChange(uploadedFilesIds);
        } else {
          field.onChange(field.value ? field.value.concat(uploadedFilesIds) : uploadedFilesIds);
          uploadedFilesIds.forEach((id, index) => {
            console.log("file_name", files[index]?.name?.toString())
            setValue(name + id + '_filename', String(files[index]?.path));
            setValue(name + id + '_base64', files[index].base64);
            setValue(name + id + '_type', files[index].type);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeAttachment = (id) => {
    clearErrors(name);
    if (!multiple) {
      field.onChange([]);
      setValue(name + '_filename', '');
      setValue(name + '_type', '');
      setValue(name + '_base64', '');
      setCurrentFiles([])
    } else {
      field.onChange(field.value.filter((file) => file !== id));
      setValue(name + id + '_filename', '');
      setValue(name + id + '_type', '');
      setValue(name + id + '_base64', '');
      setCurrentFiles(currentFiles.filter((file) => file.id !== id))

    }
  };
  const globalDialog = useGlobalDialogContext();

  const handleOpenViewFileDialog = (id) => {
    let selectedFile;

    if (!multiple) {
      selectedFile = {
        name: getValues(name + '_filename'),
        type: getValues(name + '_type'),
        base64: getValues(name + '_base64')
      }
    } else {
      const myFiles = []
      const filesIds = getValues(name);
      for (let i = 0; i < filesIds.length; i++) {
        myFiles.push({
          id: filesIds[i],
          name: getValues(name + filesIds[i] + '_filename'),
          type: getValues(name + filesIds[i] + '_type'),
          base64: getValues(name + filesIds[i] + '_base64')
        })
      }

      selectedFile = myFiles.find((file) => file.id === id)
    }

    setViewFile(selectedFile)
  };

  const handleCloseViewFileDialog = () => {
    setViewFile(null)
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.5)',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></div>
      )}
      <Stack direction="row" alignItems="center" gap={1}>
        <Stack flex={1}>
          <UploadField
            multiple={multiple}
            error={!!error}
            file={getValues(name + '_filename')}
            onDrop={(acceptedFiles) => {
              uploadFiles(acceptedFiles)
            }}
            loading={loading}
            sx={{
              ...sx,
              ...(error && {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: (theme) => `${theme.palette.error.main} !important`,
                },
              }),
            }}
            {...other}
          />

          {/* <iframe title=multiple width='500' height='200' alt="" src={`data:${currentFiles.type};base64,${currentFiles.base64}`} /> */}

        </Stack>
        {!multiple && field?.value?.length > 0 && (
          <>
            {getValues(name + '_base64') && (
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenViewFileDialog}
              >
                {t('show')}
              </Button>)}


            <Button

              onClick={removeAttachment} variant="text" size="small" color="error">
              {t('remove')}
            </Button>
          </>
        )}
      </Stack>

      {/* List attachment names + remove btn */}

      {
        multiple && field.value?.length > 0 && (
          <Stack direction="column" gap={1} sx={{ mt: 1 }}>
            {field.value.map((id) => (
              <Stack key={id} direction="row" alignItems="center" gap={1}>
                <Typography variant="body2">{getValues(name + id + '_filename')}</Typography>
                <Button
                  onClick={() => removeAttachment(id)}
                  variant="text"
                  size="small"
                  color="error"
                >
                  {t('remove')}
                </Button>
                <Button variant='contained'
                  color='primary' onClick={() => handleOpenViewFileDialog(id)}>
                  {t('show')}
                </Button>
              </Stack>
            ))}
          </Stack>
        )
      }
      <FormHelperText sx={{ px: 2 }}>
        {t('file_size_cant_be_larger_than', {
          size: getSizeInMB(maxFileSize)?.replace('.00', ''),
          unit: t('megabyte'),
        })}
        <br />
        {t('allowed_extensions')}:{' '}
        {allowedExtensionsList
          .slice()
          // .map(ext => {
          //   return parseExtension(ext)
          // })
          .join(', ')}
        <br />
        {!!multiple &&
          t('maximum_files_allowed', {
            max: maximimFiles,
          })}
      </FormHelperText>

      {
        !!error && (
          <FormHelperText error sx={{ px: 2 }}>
            {error.message}
          </FormHelperText>
        )
      }

      {/* Our View File Dialog */}
      {
        viewFile && <>
          <Dialog
            fullWidth
            maxWidth={"md"}
            open
            onClose={handleCloseViewFileDialog}
            sx={{
              overflow: 'hidden',

            }}

          >
            <IconButton
              onClick={handleCloseViewFileDialog}
              sx={{
                position: 'absolute',
                top: (theme) => theme.spacing(1),
                right: (theme) => theme.spacing(1),
                zIndex: 1000,
              }}
            >
              <SvgColor src="/assets/icons/designer/close.svg" color="text.secondary" width={24} />
            </IconButton>
            <hr></hr>
            <DialogTitle sx={{ maxWidth: "100%", pb: 1, textAlign: 'center', overflowWrap: 'break-word' }}>
              <Typography variant="h6">
                {viewFile?.name}
              </Typography>
            </DialogTitle>

            {/* <DialogContent */}

            {viewFile?.type === "application/pdf" ? (
              <iframe
                src={`data:application/pdf;base64,${viewFile?.base64}`}

              />
            ) : (
              <Box sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                // width: "100%",
                height: "100%",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                pb: 4,
                px: 4
              }}>

                <img
                  src={`data:${viewFile?.type};base64,${viewFile?.base64}`}

                />

              </Box>
            )}


            {/* </DialogContent> */}
          </Dialog>
        </>
      }

    </div>
  );
}

RHFUploadField.propTypes = {
  name: PropTypes.string,
  sx: PropTypes.object,
  uploadStrategy: PropTypes.string,
  destinationApi: PropTypes.string,
  destinationApiToken: PropTypes.string,
  destinationExtraArgs: PropTypes.object,
  responseFileNameKey: PropTypes.string,
  allowedExtensions: PropTypes.arrayOf(PropTypes.string),
  minFileSize: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  maxFileSize: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
};

RHFUpload.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  sx: PropTypes.object,
};
