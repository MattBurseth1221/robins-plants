import { Lucia } from "lucia";
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import { pool } from "../_lib/db";
import { cookies } from "next/headers";
import { cache } from "react";

import type { Session, User } from "lucia";
import type { DatabaseUser } from "../_lib/db";

const adapter = new NodePostgresAdapter(pool, {
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
		const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
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
				(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
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
