declare module "react-window" {
  import { CSSProperties, ReactNode } from "react";

  export interface GridChildProps {
    columnIndex: number;
    rowIndex: number;
    style: CSSProperties;
    isScrolling?: boolean;
  }

  export interface FixedSizeGridProps {
    columnCount: number;
    columnWidth: number;
    height: number;
    rowCount: number;
    rowHeight: number;
    width: number;
    children: (props: GridChildProps) => ReactNode;
    onScroll?: (props: { scrollLeft: number; scrollTop: number }) => void;
  }

  export const FixedSizeGrid: React.ComponentType<FixedSizeGridProps>;
}
