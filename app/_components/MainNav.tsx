import NavItem from "./NavItem";
import { validateRequest } from "../_lib/auth";
import ProfileBar from "./ProfileBar";

export default async function MainNav({ active }: { active: string }) {
  const { user } = await validateRequest();

  //const router = useRouter();

  // async function logout() {
  //   const result = await fetch(`/api/auth`);

  //   if (result.ok) {
  //     router.push(result.url);
  //     return;
  //   }
  // }

  return (
    <div className="w-52 hidden lg:block">
      <nav className="">
        <ul className="">
          <NavItem
            linkRedirect="/"
            itemName="Home"
            active={active === "Home"}
          />
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
          <NavItem
            linkRedirect={`/profile/${user!.username}`}
            itemName="Profile"
            active={active === "Profile"}
          />
        </ul>
      </nav>
      <ProfileBar />
    </div>
  );
}
