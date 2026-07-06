import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/* ────────────────────────────────────────────────────────────
   Auth.js (NextAuth) core tables — required by @auth/drizzle-adapter
   ──────────────────────────────────────────────────────────── */
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  // ── JuwaFire additions ──
  username: text("username").unique(),
  passwordHash: text("passwordHash"),
  role: text("role").notNull().default("player"), // player | staff | admin
  // wallet balance in CENTS (integer = no float rounding bugs)
  balanceCents: integer("balanceCents").notNull().default(0),
  // lifetime total deposited in CENTS — drives VIP tier (only ever increases)
  lifetimeDepositCents: integer("lifetimeDepositCents").notNull().default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

/* ────────────────────────────────────────────────────────────
   JuwaFire wallet / ledger
   ──────────────────────────────────────────────────────────── */
export const txTypeEnum = pgEnum("tx_type", [
  "deposit",
  "load",
  "cashout",
  "bonus",
  "adjustment",
]);

export const reqStatusEnum = pgEnum("req_status", [
  "pending",
  "approved",
  "completed",
  "rejected",
]);

/** Append-only money ledger. Every balance change writes a row here. */
export const transactions = pgTable(
  "transaction",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: txTypeEnum("type").notNull(),
    amountCents: integer("amountCents").notNull(), // +credit / -debit
    balanceAfterCents: integer("balanceAfterCents").notNull(),
    note: text("note"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("tx_user_idx").on(t.userId, t.createdAt)],
);

/** A request to load credits onto an external game platform (Juwa, etc.). */
export const loadRequests = pgTable("load_request", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gameKey: text("gameKey").notNull(), // which platform/game
  gameUsername: text("gameUsername"), // player's account on that platform
  amountCents: integer("amountCents").notNull(),
  status: reqStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

/** A request to cash out winnings back to the player. */
export const cashoutRequests = pgTable("cashout_request", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amountCents: integer("amountCents").notNull(),
  method: text("method").notNull(), // cashapp | paypal | chime | zelle ...
  destination: text("destination").notNull(), // cashtag / email / handle
  status: reqStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

/* ────────────────────────────────────────────────────────────
   Live support chat (user ↔ admin). One thread per user.
   ──────────────────────────────────────────────────────────── */
export const chatSenderEnum = pgEnum("chat_sender", ["user", "admin"]);

export const chatMessages = pgTable(
  "chat_message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sender: chatSenderEnum("sender").notNull(),
    body: text("body"),
    imageUrl: text("imageUrl"),
    readByUser: timestamp("readByUser", { mode: "date" }),
    readByAdmin: timestamp("readByAdmin", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("chat_user_idx").on(t.userId, t.createdAt)],
);
