import "../globals.css";

type Props = {
    title: string;
}

export default function PageTitle({title}: Props) {
    return <h2 className="text-4xl mb-10 z-10">{title}</h2>;
}