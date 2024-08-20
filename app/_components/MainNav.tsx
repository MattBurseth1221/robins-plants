import NavItem from "./NavItem";
import { validateRequest } from "../_lib/auth";
import { userIsAdmin } from "../_utils/helper-functions";

export default async function MainNav({ active }: {active: string}) {
  const { user } = await validateRequest();

  return (
    <nav className="w-40 px-5 pt-5">
      <ul>
        <NavItem linkRedirect="/" itemName="Home" active={active === "Home"} />
        <NavItem
          linkRedirect="/directory"
          itemName="Directory"
          active={active === "Directory"}
        />
        <NavItem
          linkRedirect="/about"
          itemName="About"
          active={active === "About"}
        />
        {/* {userIsAdmin(user) && (
          <NavItem
            linkRedirect="/admin"
            itemName="Create Post"
            active={active === "Admin"}
          />
        )} */}
        <NavItem
            linkRedirect="/admin"
            itemName="Create Post"
            active={active === "Admin"}
          />
      </ul>
    </nav>
  );
}
