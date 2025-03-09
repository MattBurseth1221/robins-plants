export default function PostPill({
  type,
  text,
}: {
  type: string;
  text: string;
}) {
  let typeColor = "green-500";
  let borderColor = "green-500";
  switch (type) {
    case "genus":
      typeColor = "text-red-500";
      borderColor = "border-red-500";
      break;
    case "postType":
      typeColor = "text-blue-400";
      borderColor = "border-blue-400";
  }

  return (
    <div className={`rounded-3xl border-[1px] ${borderColor} px-2 m-2`}>
      <span className={`${typeColor} text-sm`}>{`${text}`}</span>
    </div>
  );
}
