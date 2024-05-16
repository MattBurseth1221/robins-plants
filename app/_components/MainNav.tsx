"use client"

import NavItem from "./NavItem" 

type MainNavProps = {
  active: string
}

export default function MainNav({active} : MainNavProps) {
  return (
    <nav className="w-40 min-h-screen absolute left-0 px-5 border-r-white-200 border-opacity-50">
      <ul>
        <NavItem linkRedirect="/" itemName="Home" active={active === "Home"} />
        <NavItem
          linkRedirect="/directory"
          itemName="Directory"
          active={active === "Directory"}
        />
      </ul>
    </nav>
  );
}
