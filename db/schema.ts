import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
id: integer('id').primaryKey({autoIncrement: true}),
username: text('username').notNull(),
password: text('password').notNull(),
});



export const categories = sqliteTable('categories', {
id: integer('id').primaryKey({autoIncrement: true}),
user_id: integer('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
name: text('name').notNull(),
colour_id: integer('colour_id').notNull() 
});



export const habits = sqliteTable('habits', {
id: integer('id').primaryKey({autoIncrement: true}),
user_id: integer('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
category_id: integer('category_id').notNull().references(() => categories.id, {onDelete: 'cascade'}),
name: text('name').notNull(),
metric_type: text('metric_type').notNull(), 
icon_id: integer('icon_id').notNull(), 
created_at: text('created_at').notNull(), 
});



export const habit_logs = sqliteTable('habit_logs', {
id: integer('id').primaryKey({autoIncrement: true}),
habit_id: integer('habit_id').notNull().references(() => habits.id, {onDelete: 'cascade'}),
logged_at: text('logged_at').notNull(),
value: integer('value').notNull(),
});



export const targets = sqliteTable('targets', {
id: integer('id').primaryKey({autoIncrement: true}),
habit_id: integer('habit_id').notNull().references(() => habits.id, {onDelete: 'cascade'}),
period: text('period').notNull(),
amount: integer('amount').notNull(), 
});