type Props = {
    itemName: string;
    linkRedirect: string;
    active: Boolean;
  };
  
  export default function NavItem({ itemName, linkRedirect, active }: Props) {
    return (
      <li
        className={`mb-5 text-center hover:bg-green-800
        hover:text-white cursor-pointer py-2 rounded-2xl transition ease-in duration-150 ${
          active ? "underline text-black" : ""
        }`}
      >
        <a href={linkRedirect}>{itemName}</a>
      </li>
    );
  }