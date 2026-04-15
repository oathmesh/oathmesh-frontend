// @file db/schema.ts
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// ─── Wishlist ────────────────────────────────────────────────────────────────

export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 120 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 50 }).notNull(), // 'sdk' | 'feature' | 'integration' | 'docs' | 'other'
    status: varchar('status', { length: 30 }).notNull().default('open'), // 'open' | 'planned' | 'in-progress' | 'shipped' | 'declined'
    votes: integer('votes').notNull().default(0),
    authorName: varchar('author_name', { length: 80 }),
    authorEmail: varchar('author_email', { length: 200 }),
    githubIssueUrl: varchar('github_issue_url', { length: 300 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    idxStatus: index('wishlist_items_status_idx').on(t.status),
    idxVotes: index('wishlist_items_votes_idx').on(t.votes),
    idxCategory: index('wishlist_items_category_idx').on(t.category),
  }),
);

export const wishlistVotes = pgTable(
  'wishlist_votes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id')
      .references(() => wishlistItems.id)
      .notNull(),
    voterFingerprint: varchar('voter_fingerprint', { length: 64 }).notNull(), // SHA-256 of IP+UA
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    uniq: unique().on(t.itemId, t.voterFingerprint),
  }),
);

// ─── Donations ───────────────────────────────────────────────────────────────

export const donations = pgTable(
  'donations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    stripeSessionId: varchar('stripe_session_id', { length: 200 })
      .unique()
      .notNull(),
    stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 200 }),
    amountCents: integer('amount_cents').notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('usd'),
    donorName: varchar('donor_name', { length: 120 }),
    donorEmail: varchar('donor_email', { length: 200 }),
    showOnWall: boolean('show_on_wall').notNull().default(true),
    message: text('message'),
    status: varchar('status', { length: 30 }).notNull().default('pending'), // 'pending' | 'completed' | 'failed' | 'refunded'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (t) => ({
    idxStatus: index('donations_status_idx').on(t.status),
    idxEmail: index('donations_donor_email_idx').on(t.donorEmail),
  }),
);

// ─── Subscribers ─────────────────────────────────────────────────────────────

export const subscribers = pgTable(
  'subscribers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 200 }).unique().notNull(),
    source: varchar('source', { length: 50 }).default('landing'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    idxEmail: unique('subscribers_email_uniq').on(t.email),
  }),
);

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 200 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type WishlistItem = typeof wishlistItems.$inferSelect;
export type NewWishlistItem = typeof wishlistItems.$inferInsert;
export type WishlistVote = typeof wishlistVotes.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
