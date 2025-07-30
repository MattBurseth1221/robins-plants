export default function PostPill({
  type,
  text,
}: {
  type: string;
  text: string;
}) {
  let typeColor = "text-accent";
  let borderColor = "border-accent";
  switch (type) {
    case "genus":
      typeColor = "text-primary";
      borderColor = "border-primary";
      break;
    case "postType":
      typeColor = "text-secondary";
      borderColor = "border-secondary";
      break;
  }

  return (
    <div className={`rounded-3xl border-[1px] ${borderColor} px-2 m-2`}>
      <span className={`${typeColor} text-sm`}>{`${text}`}</span>
    </div>
  );
}