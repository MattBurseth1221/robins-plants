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

      <p>{process.env.HOME_URL}/reset-password?id={tempPasswordID}</p>

      <h3>Thank you for your continued support on the site. If you have any issues or find any bugs, email me at <code>mattburseth2@gmail.com.</code></h3>
    </div>
  );
}
