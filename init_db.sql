CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.auth_user (
    id uuid NOT NULL,
    create_date timestamptz NOT NULL DEFAULT now(),
    username varchar NOT NULL,
    email varchar NOT NULL,
    password_hash varchar NOT NULL,
    first_name varchar,
    last_name varchar,
    CONSTRAINT auth_user_pkey PRIMARY KEY (id),
    CONSTRAINT auth_user_unique UNIQUE (username),
    CONSTRAINT auth_user_unique_1 UNIQUE (email)
);


CREATE TABLE IF NOT EXISTS public.chats (
    id uuid NOT NULL,
    display_id varchar NOT NULL,
    chat_users varchar NOT NULL,
    chat_name varchar NOT NULL,
    CONSTRAINT chats_pk PRIMARY KEY (id),
    CONSTRAINT chats_unique UNIQUE (display_id)
);


CREATE TABLE IF NOT EXISTS public.posts (
    title varchar NOT NULL,
    body varchar NOT NULL,
    image_ref varchar,
    user_id uuid,
    create_date timestamptz NOT NULL DEFAULT now(),
    post_id uuid NOT NULL,
    total_likes integer NOT NULL DEFAULT 0,
    pills varchar DEFAULT '{}',
    CONSTRAINT posts_pk PRIMARY KEY (post_id)
);


CREATE TABLE IF NOT EXISTS public.comments (
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    been_edited boolean NOT NULL DEFAULT false,
    body varchar NOT NULL,
    post_id uuid,
    create_date timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT comments_pk PRIMARY KEY (comment_id),
    CONSTRAINT comments_posts_fk
        FOREIGN KEY (post_id)
        REFERENCES public.posts(post_id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.likes (
    like_id uuid NOT NULL,
    parent_id uuid NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT likes_pk PRIMARY KEY (like_id),
    CONSTRAINT likes_posts_fk
        FOREIGN KEY (parent_id)
        REFERENCES public.posts(post_id)
        ON DELETE CASCADE,
    CONSTRAINT likes_auth_user_fk
        FOREIGN KEY (user_id)
        REFERENCES public.auth_user(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.messages (
    id uuid NOT NULL,
    message_data json NOT NULL,
    create_date timestamptz NOT NULL DEFAULT now(),
    display_chat_id varchar NOT NULL,
    CONSTRAINT messages_pk PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.password_change_requests (
    id varchar NOT NULL,
    create_date timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL,
    CONSTRAINT password_change_requests_pk PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.user_session (
    id text NOT NULL,
    expires_at timestamptz NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT user_session_pkey PRIMARY KEY (id),
    CONSTRAINT user_session_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.auth_user(id)
);
