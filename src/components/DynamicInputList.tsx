// import { useState } from "react";

const DynamicInputList = ({
  stringArr,
  setStringArr,
}: {
  stringArr: string[];
  setStringArr: (stringArr: string[]) => void;
}) => {
  //   const [openTabUrls, setOpenTabUrls] = useState<string[]>([]);

  // 새 input 추가
  const handleAddInput = () => {
    setStringArr([...stringArr, ""]); // 빈 문자열로 초기화된 새로운 입력 필드 추가
  };

  // 특정 input 값 업데이트
  const handleInputChange = (index: number, value: string) => {
    const updatedUrls = [...stringArr];
    updatedUrls[index] = value;
    setStringArr(updatedUrls);
  };

  // 특정 input 삭제
  const handleRemoveInput = (index: number) => {
    const updatedUrls = stringArr.filter((_, i) => i !== index);
    setStringArr(updatedUrls);
  };

  return (
    <div className="space-y-2">
      {/* 기존 입력 필드 렌더링 */}
      {stringArr.map((url, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="url"
            value={url}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={`Enter URL ${index + 1}`}
            className="border rounded px-2 py-1 w-full"
          />
          <button
            type="button"
            onClick={() => handleRemoveInput(index)}
            className="text-red-500 font-bold"
          >
            ✖
          </button>
        </div>
      ))}

      {/* + 버튼 */}
      <button
        type="button"
        onClick={handleAddInput}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Add Input
      </button>

      {/* 현재 상태 표시 */}
      {/* <div className="mt-4">
        <h2 className="text-lg font-semibold">Current URLs:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(openTabUrls, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default DynamicInputList;
