interface LoaderProps {
  width?: number;
  height?: number;
}

export const Loader = ({ height, width }: LoaderProps) => (
  <div
    style={{
      width: `${width || 28}px`,
      height: `${height || width || 28}px`,
    }}
    className="mx-auto my-5 animate-spin rounded-full border-2 border-b-0 border-r-0 border-redBg"
  ></div>
);
