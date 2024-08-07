interface EmailTemplateProps {
  firstName: string;
  tempPasswordID: string
}

export default function ResetPasswordEmail({ firstName, tempPasswordID }: EmailTemplateProps) {
  return (
    <div>
      <h1>Hi, {firstName + "!"}</h1>

      <h3>
        Click the link below to change your password. If you are having issues, please restart the process.
      </h3>

      <p>{process.env.URL}/reset-password?id={tempPasswordID}</p>
      <p>{process.env.URL}</p>

      <a href={`${process.env.URL}/reset-password?id=${tempPasswordID}`}></a>
    </div>
  );
}
