import Link from "next/link";

type NavProps = {
  itemName: string;
  linkRedirect: string;
  active: Boolean;
};

//OLD
//border-x-gray-500 border-opacity-50 border-x

export default function NavItem({ itemName, linkRedirect, active }: NavProps) {
  return (
    <Link href={linkRedirect} className="block">
      <button
        className={`w-full text-left px-4 py-2 rounded-lg transition duration-150 ease-in mb-1
          ${active ? "bg-primary text-white shadow-sm font-semibold border-l-4 border-primary" : "text-muted hover:bg-primary/10 hover:text-primary"}
          focus:outline-hidden focus:ring-2 focus:ring-primary/30`}
      >
        {itemName}
      </button>
    </Link>
  );
}
