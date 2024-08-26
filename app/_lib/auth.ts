import { Lucia } from "lucia";
// import { NodePostgresAdapter,  } from '@lucia-auth/adapter-postgresql';
import { sql } from "../_lib/db";
import { cookies } from "next/headers";
import { cache } from "react";

import type { Session, User } from "lucia";
import type { DatabaseUser } from "../_lib/db";
import { NeonHTTPAdapter } from "@lucia-auth/adapter-postgresql";

const adapter = new NeonHTTPAdapter(sql, {
    user: "auth_user",
    session: "user_session"
})

export const lucia = new Lucia(adapter, {
	// sessionExpiresIn: new TimeSpan(20, 's'),
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, "id">;
	}
}
