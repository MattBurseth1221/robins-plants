type NavProps = {
  itemName: string;
  linkRedirect: string;
  active: Boolean;
};

//OLD
//border-x-gray-500 border-opacity-50 border-x-[1px]

export default function NavItem({ itemName, linkRedirect, active }: NavProps) {
  return (
    <a href={linkRedirect} className="text-lg">
      <button
        className={`px-5 mb-5 w-[100%] text-left hover:bg-slate-400
         cursor-pointer py-2 transition ease-in duration-150 rounded-lg ${
           active ? "underline text-black" : ""
         }`}
      >
        {itemName}
      </button>
    </a>
  );
}
