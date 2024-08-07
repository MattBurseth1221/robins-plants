interface EmailTemplateProps {
  firstName: string;
  tempPassword: string
}

export default function ResetPasswordEmail({ firstName, tempPassword }: EmailTemplateProps) {
  return (
    <div>
      <h1>Hi, {firstName + "!"}</h1>

      <h3>
        We've temporarily changed your password. Use this new one to log back in
        and change your password in the app.
      </h3>
    </div>
  );
}
