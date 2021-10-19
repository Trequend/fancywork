import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';

type LayoutProps = {
  title: string;
  onBack?: () => void;
};

type Layout = FC<LayoutProps>;

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

type StagesProps = {
  layout: Layout;
  onFinish?: () => void;
};

type StagesType = {
  Stage: typeof Stage;
} & FC<StagesProps>;

export const Stages: StagesType = ({ children, layout, onFinish }) => {
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
    if (stageIndex === length - 1) {
      onFinish && onFinish();
    } else {
      setStageIndex(stageIndex + 1);
    }
  }, [stageIndex, onFinish, childrenArray.length]);

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
