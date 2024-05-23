"use client"

import NavItem from "./NavItem" 

type MainNavProps = {
  active: string
}

export default function MainNav({active} : MainNavProps) {
  return (
    <nav className="w-40 px-5 pt-5 border-r-white-200 border-opacity-50">
      <ul>
        <NavItem linkRedirect="/" itemName="Home" active={active === "Home"} />
        <NavItem
          linkRedirect="/directory"
          itemName="Directory"
          active={active === "Directory"}
        />
        <NavItem linkRedirect="/posts" itemName="Posts" active={active === "Posts"} />
        <NavItem linkRedirect="/about" itemName="About" active={active === "About"} />
      </ul>
    </nav>
  );
}
