import { LoadingOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Stages } from 'src/components/contexts';
import { BasicLayout } from 'src/components/layouts';
import { convertSchemaSize } from 'src/core/functions/convertSchemaSize';
import { createSchema } from 'src/core/functions/createSchema';
import { Schema } from 'src/core/types';
import { AppPage } from 'src/types';
import { CREATE_SCHEMA_PATHNAME } from './constants';
import styles from './CreateSchema.module.scss';
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

  const generateSchema = async (
    imageURL: string,
    generalSettings: GeneralSettingsValues,
    sizeSettings: SizeSettingsValues,
    paletteSettings: PaletteSettingsValues
  ) => {
    setLoading(true);
    try {
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
      });

      setSchema(schema);
    } catch (error) {
      message.error((error as any).toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sourceImage) {
      return;
    }

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
    <div
      className={styles.root}
      style={loading ? { overflow: 'hidden' } : undefined}
    >
      {loading ? (
        <div className={styles.blur}>
          <Spin indicator={<LoadingOutlined className={styles.icon} />} />
        </div>
      ) : null}
      <Stages
        layout={({ title, onBack, children }) => {
          return (
            <BasicLayout title={title} onBack={onBack}>
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
            schema ? <GeneratorResult schema={schema} /> : null
          }
        </Stages.Stage>
      </Stages>
    </div>
  );
};

CreateScheme.pathname = CREATE_SCHEMA_PATHNAME;
CreateScheme.isExactPathname = false;
