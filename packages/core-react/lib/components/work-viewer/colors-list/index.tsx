import { CheckOutlined } from '@ant-design/icons';
import { getContrastColor, Palette, WorkViewProvider } from '@fancywork/core';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';

type Props = {
  className?: string;
  palette: Palette;
  viewProvider: WorkViewProvider;
  colorCode?: string;
  onColorClick: (code: string) => void;
};

export const ColorsList: FC<Props> = ({
  className,
  palette,
  viewProvider,
  colorCode,
  onColorClick,
}) => {
  const [leftBorderVisible, setLeftBorderVisible] = useState(false);
  const [rightBorderVisible, setRightBorderVisible] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const colors = useMemo(() => {
    return palette.colors.map((color) => {
      return {
        code: color.code,
        hex: color.hex,
        symbol: viewProvider.getColorSymbol(color.code),
        symbolColor: getContrastColor(color.hex),
      };
    });
  }, [viewProvider, palette]);

  const updateBorders = useCallback(() => {
    if (divRef.current) {
      setLeftBorderVisible(divRef.current.scrollLeft !== 0);
      setRightBorderVisible(
        divRef.current.scrollLeft + divRef.current.clientWidth <
          divRef.current.scrollWidth
      );
    }
  }, []);

  useEffect(() => {
    updateBorders();

    const listener = () => {
      updateBorders();
    };

    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [updateBorders]);

  return (
    <div
      className={`${styles.container} ${className} ${
        leftBorderVisible ? styles.leftBorder : ''
      } ${rightBorderVisible ? styles.rightBorder : ''}`}
    >
      <div ref={divRef} className={styles.content} onScroll={updateBorders}>
        {colors.map(({ code, hex, symbol, symbolColor }) => {
          const statistics = viewProvider.getColorStatistics(code);
          if (statistics.cellsCount === statistics.embroideredCellsCount) {
            return (
              <div key={code} className={`${styles.color} ${styles.success}`}>
                <CheckOutlined />
              </div>
            );
          } else {
            return (
              <div
                key={code}
                className={`${styles.color} ${
                  code === colorCode ? styles.selected : ''
                }`}
                style={{
                  backgroundColor: hex,
                  color: symbolColor,
                }}
                onClick={() => {
                  onColorClick(code);
                }}
              >
                {symbol}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
