'use client'

export default function ProfileBar({ user, logoutFunc }: any) {
  return (
    <nav className="w-40 p-5 border-black border-2 h-64">
      <ul className="flex flex-col justify-between items-center">
        <p>{ user.username }</p>
        {user ?
            <button className="bg-slate-400 p-1 w-auto rounded-xl" onClick={() => {
                logoutFunc();
            }}>Log out</button>
        :
            <a href="/login">Sign in</a>}
      </ul>
    </nav>
  );
}
