import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { number } from "zod";

export default function Quantity({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div>
      <div className="flex gap-1 ">
        <Button
          className="h-6 w-6 p-0"
          disabled={value === 0}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <Input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          className="h-6 p-1 w-8 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-non"
          value={value}
          onChange={(e) => {
            let value = e.target.value;
            const numberValue = Number(value);
            if (isNaN(numberValue)) {
              return;
            }
            onChange(numberValue);
          }}
        />
        <Button className="h-6 w-6 p-0" onClick={() => onChange(value + 1)}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
