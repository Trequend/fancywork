import { CloseOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Stages } from 'src/components/contexts';
import { BasicLayout } from 'src/components/layouts';
import { FullscreenSpin } from 'src/components/ui/FullscreenSpin';
import { convertSchemaSize } from 'src/core/functions/convertSchemaSize';
import { createSchema } from 'src/core/functions/createSchema';
import { Schema } from 'src/core/types';
import { useAppStorage } from 'src/storage/AppStorageContext';
import { AppPage } from 'src/types';
import { SCHEMAS_PATHNAME } from '../Schemas/constants';
import { CREATE_SCHEMA_PATHNAME } from './constants';
import { ChooseImage } from './Stages/ChooseImage';
import {
  GeneralSettings,
  GeneralSettingsValues,
} from './Stages/GeneralSettings';
import { GeneratorResult } from './Stages/GeneratorResult';
import {
  PaletteSettings,
  PaletteSettingsValues,
} from './Stages/PaletteSettings';
import { SizeSettings, SizeSettingsValues } from './Stages/SizeSettings';

export const CreateScheme: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const [sourceImage, setSourceImage] = useState<File>();
  const [imageURL, setImageURL] = useState<string>();
  const [image, setImage] = useState<HTMLImageElement>();

  const [generalSettings, setGeneralSettings] =
    useState<GeneralSettingsValues>();
  const [sizeSettings, setSizeSettings] = useState<SizeSettingsValues>();
  const [paletteSettings, setPaletteSettings] =
    useState<PaletteSettingsValues>();

  const [loading, setLoading] = useState<boolean>(false);
  const [schema, setSchema] = useState<Schema>();

  const executeTask = async (task: () => Promise<void>) => {
    setLoading(true);
    try {
      await task();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSchema = async (
    imageURL: string,
    generalSettings: GeneralSettingsValues,
    sizeSettings: SizeSettingsValues,
    paletteSettings: PaletteSettingsValues
  ) => {
    await executeTask(async () => {
      const size = convertSchemaSize(
        sizeSettings.width,
        sizeSettings.height,
        generalSettings.stitchCount,
        sizeSettings.sizeType
      );

      const schema = await createSchema(imageURL, {
        name: generalSettings.name,
        palette: generalSettings.palette,
        stitchCount: generalSettings.stitchCount,
        width: size.width,
        height: size.height,
        maxColorsCount: paletteSettings.maxColorsCount,
        reduceAlgorithm: paletteSettings.reduceAlgorithm,
        withDithering: paletteSettings.withDithering,
      });

      setSchema(schema);
    });
  };

  const onFinish = async () => {
    if (schema) {
      await executeTask(async () => {
        await appStorage.add('schemas', schema);
        history.replace(SCHEMAS_PATHNAME);
      });
    }
  };

  useEffect(() => {
    if (!sourceImage) {
      return;
    }

    setGeneralSettings(undefined);
    setSizeSettings(undefined);
    setPaletteSettings(undefined);

    const url = URL.createObjectURL(sourceImage);
    setImageURL(url);

    const image = new Image();
    image.src = url;
    image.onload = () => {
      setImage(image);
    };

    return () => {
      image.remove();
      setImage(undefined);
      setImageURL(undefined);
      URL.revokeObjectURL(url);
    };
  }, [sourceImage]);

  return (
    <>
      <FullscreenSpin loading={loading} delay={500} />
      <Stages
        onFinish={() => {
          onFinish();
        }}
        layout={({ title, onBack, children }) => {
          return (
            <BasicLayout
              title={title}
              onBack={
                onBack ??
                (() => {
                  history.goBack();
                })
              }
              extra={
                onBack ? (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      history.goBack();
                    }}
                  />
                ) : null
              }
            >
              {children}
            </BasicLayout>
          );
        }}
      >
        <Stages.Stage title="Choose image">
          {(completeStage) => (
            <ChooseImage
              onChoose={(image) => {
                setSourceImage(image);
                completeStage();
              }}
            />
          )}
        </Stages.Stage>
        <Stages.Stage title="Generator">
          {(completeStage) =>
            imageURL ? (
              <GeneralSettings
                imageURL={imageURL}
                initialValues={generalSettings}
                onSubmit={(result) => {
                  setGeneralSettings(result);
                  completeStage();
                }}
              />
            ) : null
          }
        </Stages.Stage>
        <Stages.Stage title="Schema size">
          {(completeStage) =>
            generalSettings && imageURL && image ? (
              <SizeSettings
                imageURL={imageURL}
                image={image}
                initialValues={sizeSettings}
                onSubmit={(result) => {
                  setSizeSettings(result);
                  completeStage();
                }}
              />
            ) : null
          }
        </Stages.Stage>
        <Stages.Stage title="Schema palette">
          {(completeStage) =>
            sizeSettings && imageURL && image ? (
              <PaletteSettings
                imageURL={imageURL}
                initialValues={paletteSettings}
                onSubmit={(result) => {
                  const action = async () => {
                    setPaletteSettings(result);
                    await generateSchema(
                      imageURL!,
                      generalSettings!,
                      sizeSettings,
                      result
                    );
                    completeStage();
                  };

                  action();
                }}
              />
            ) : null
          }
        </Stages.Stage>
        <Stages.Stage title="Result">
          {(completeStage) =>
            schema ? (
              <GeneratorResult
                schema={schema}
                onSave={() => {
                  completeStage();
                }}
              />
            ) : null
          }
        </Stages.Stage>
      </Stages>
    </>
  );
};

CreateScheme.pathname = CREATE_SCHEMA_PATHNAME;
