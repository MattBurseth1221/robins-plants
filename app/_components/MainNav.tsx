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
    <div className="w-56 hidden lg:flex flex-col h-full bg-surface border-r border-border shadow-md py-8 px-4 justify-between">
      <nav className="flex-1">
        <ul className="space-y-2">
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
      <div className="mt-8">
        <ProfileBar />
      </div>
    </div>
  );
}
