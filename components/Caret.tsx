import * as React from "react";

interface CaretProps {
  loading?: boolean;
}

export const Caret: React.FC<CaretProps> = ({ loading }) => {
  return (
    <div>
      {loading ? (
        <div className="loader" />
      ) : (
        <svg
          width="9"
          height="12"
          viewBox="0 0 9 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L8 6L1 11" stroke="#8E8E8E" />
        </svg>
      )}
    </div>
  );
};
