import "../globals.css";

export default function PageTitle({title}: {title: string}) {
    return <h2 className="text-4xl mb-10 z-10">{title}</h2>;
}