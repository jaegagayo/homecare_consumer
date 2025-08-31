import { Heading, TextArea } from "@radix-ui/themes";

interface SpecialRequestsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SpecialRequestsInput({ value, onChange }: SpecialRequestsInputProps) {
  return (
    <div className="space-y-3">
      <Heading size="3">특별 요청사항</Heading>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="요양보호사에게 전달할 특별한 요청사항이 있다면 입력해주세요"
        className="w-full"
        rows={4}
      />
    </div>
  );
}
