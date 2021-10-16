import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';

type LayoutProps = {
  title: string;
  onBack?: () => void;
};

type Layout = FC<LayoutProps>;

type StagesProps = {
  layout: Layout;
};

type ContextType = {
  completeStage: () => void;
  goBack?: () => void;
  layout: Layout;
};

const StagesContext = React.createContext<ContextType | undefined>(undefined);

type StageProps = {
  title: string;
  children: (completeStage: () => void) => ReactNode;
};

function Stage({ children, title }: StageProps) {
  return (
    <StagesContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error('No context (Stages)');
        }

        const Layout = context.layout;
        const { goBack, completeStage } = context;

        return (
          <Layout title={title} onBack={goBack}>
            {children(completeStage)}
          </Layout>
        );
      }}
    </StagesContext.Consumer>
  );
}

type StagesType = {
  Stage: typeof Stage;
} & FC<StagesProps>;

export const Stages: StagesType = ({ children, layout }) => {
  const [stageIndex, setStageIndex] = useState(0);

  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const length = childrenArray.length;
    if (stageIndex > length - 1 && length !== 0) {
      setStageIndex(childrenArray.length - 1);
    }
  }, [childrenArray.length, stageIndex]);

  const goBack = useCallback(() => {
    setStageIndex((index) => {
      return index === 0 ? index : index - 1;
    });
  }, []);

  const completeStage = useCallback(() => {
    const length = childrenArray.length;
    setStageIndex((index) => {
      return index === length - 1 ? index : index + 1;
    });
  }, [childrenArray.length]);

  return (
    <StagesContext.Provider
      value={{
        goBack: stageIndex === 0 ? undefined : goBack,
        completeStage,
        layout,
      }}
    >
      {childrenArray.length > 0 &&
      stageIndex >= 0 &&
      stageIndex < childrenArray.length
        ? childrenArray[stageIndex]
        : null}
    </StagesContext.Provider>
  );
};

Stages.Stage = Stage;
