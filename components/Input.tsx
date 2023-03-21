import { forwardRef, ForwardRefRenderFunction } from "react";
import { Caret } from "./Caret";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

export const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> =
  forwardRef(({ value, onChange, onEnter, loading }, ref) => {
    return (
      <div className="w-full mt-8 text-white flex items-center gap-2">
        <Caret loading={loading} />
        <input
          className="bg-transparent focus:outline-none text-lg w-full"
          value={value}
          ref={ref}
          placeholder=""
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              //@ts-ignore
              onEnter(e);
            }
          }}
        />
      </div>
    );
  });
