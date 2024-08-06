interface EmailTemplateProps {
    firstName: string;
}

export default function ResetPasswordEmail({firstName}: EmailTemplateProps) {
    return (
        <div>
            <h1>Welcome, {firstName}</h1>
        </div>
    )
}