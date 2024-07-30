import { User } from "lucia";
import NavItem from "./NavItem";
import { validateRequest } from "../_lib/auth";
import { userIsAdmin } from "../_utils/helper-functions";

type MainNavProps = {
  active: string;
};

export default async function MainNav({ active }: MainNavProps) {
  const { user } = await validateRequest();

  return (
    <nav className="w-40 px-5 pt-5 border-r-white-200 border-opacity-50">
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
        {userIsAdmin(user) && (
          <NavItem
            linkRedirect="/admin"
            itemName="Admin"
            active={active === "Admin"}
          />
        )}
      </ul>
    </nav>
  );
}
