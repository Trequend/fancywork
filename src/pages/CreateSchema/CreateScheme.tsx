import { useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { AppPage } from '../../types/AppPage';
import ChooseImage from './ChooseImage/ChooseImage';
import {
  CHOOSE_IMAGE_PATHNAME,
  CREATE_SCHEMA_PATHNAME,
  GENERATOR_PATHNAME,
} from './constants';
import Generator from './Generator';

const CreateScheme: AppPage = () => {
  const history = useHistory();
  const [sourceImage, setSourceImage] = useState<File>();

  return (
    <Switch>
      <Route exact path={CHOOSE_IMAGE_PATHNAME}>
        <ChooseImage
          onChoose={(image) => {
            setSourceImage(image);
            history.push(GENERATOR_PATHNAME);
          }}
        />
      </Route>
      <Route exact path={GENERATOR_PATHNAME}>
        {sourceImage ? (
          <Generator sourceImage={sourceImage} />
        ) : (
          <Redirect to={CHOOSE_IMAGE_PATHNAME} />
        )}
      </Route>
    </Switch>
  );
};

CreateScheme.pathname = CREATE_SCHEMA_PATHNAME;
CreateScheme.isExactPathname = false;

export default CreateScheme;
