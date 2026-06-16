"use client";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
}: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          disabled={readonly}
          onClick={() => onChange?.(s === value ? 0 : s)}
          className={`text-2xl transition-colors disabled:cursor-default
            ${s <= value ? "text-yellow-400" : "text-gray-600"}
            ${!readonly ? "hover:text-yellow-300 cursor-pointer" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
