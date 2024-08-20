type NavProps = {
    itemName: string;
    linkRedirect: string;
    active: Boolean;
  };
  
  export default function NavItem({ itemName, linkRedirect, active }: NavProps) {
    return (
      <li
        className={`mb-5 text-center hover:bg-slate-500
        hover:text-white cursor-pointer py-2 transition ease-in duration-150 border-x-gray-500 border-opacity-50 border-x-[1px] ${
          active ? "underline text-black" : ""
        }`}
      >
        <a href={linkRedirect}>{itemName}</a>
      </li>
    );
  }