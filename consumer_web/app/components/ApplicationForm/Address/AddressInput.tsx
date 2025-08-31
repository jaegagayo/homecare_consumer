import { Heading } from "@radix-ui/themes";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AddressInput({ value, onChange }: AddressInputProps) {
  return (
    <div className="space-y-3">
      <Heading size="3">서비스 주소 *</Heading>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="서비스를 받을 주소를 입력하세요"
        className="w-full h-8 px-3 border border-gray-300 rounded text-sm"
      />
    </div>
  );
}
