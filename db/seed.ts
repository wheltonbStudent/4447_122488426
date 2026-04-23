import { db } from './client';
import { categories, habit_logs, habits, targets, users } from './schema';


// function used to spread seed entries across multiple days in the past for future use whern I am testing record viewing & charts
function daysAgo(n: number): string {
const d = new Date();
d.setDate(d.getDate() - n);
    return d.toISOString();
}


export async function seedUsersIfEmpty() {
const existing = await db.select().from(users);
if (existing.length > 0) 
    return;
await db.insert(users).values([
    {username: 'Joe', password: 'password',},
    {username: 'Sarah', password: 'password',},
    {username: 'Mike', password: 'password',},
]); }



export async function seedCategoriesIfEmpty() {
const existing = await db.select().from(categories);
if (existing.length > 0) 
    return;

const all_users = await db.select().from(users);
if (all_users.length === 0)
    return;

for (const user of all_users) {
await db.insert(categories).values([
{user_id: user.id, name: 'Health & Fitness', colour_id: 6},
{user_id: user.id, name: 'Productivity', colour_id: 10},
{user_id: user.id, name: 'Social', colour_id: 7},
{user_id: user.id, name: 'Mindfulness', colour_id: 3},
]);
}}



export async function seedHabitsIfEmpty() {
const existing = await db.select().from(habits);
    if (existing.length > 0) 
        return;

const all_users = await db.select().from(users);
const all_categories = await db.select().from(categories);

for (const user of all_users) {
const user_categories = all_categories.filter((c) => c.user_id === user.id);
const health_category = user_categories.find((c) => c.name === 'Health & Fitness');
const productivity_category = user_categories.find((c) => c.name === 'Productivity');
const social_category = user_categories.find((c) => c.name === 'Social');
if (!health_category || !productivity_category || !social_category)
    return;

await db.insert(habits).values([{
    user_id: user.id,
    category_id: health_category.id,
    name: 'Morning Run',
    metric_type: 'count',
    icon_id: 4,
    created_at: new Date().toISOString(),},

    {
    user_id: user.id,
    category_id: productivity_category.id,
    name: 'Study',
    metric_type: 'duration',
    icon_id: 15,
    created_at: new Date().toISOString(),},

    {
    user_id: user.id,
    category_id: social_category.id,
    name: 'meet friends',
    metric_type: 'count',
    icon_id: 18,
    created_at: new Date().toISOString(),
},]);
}}



export async function seedTargetsIfEmpty() {
const existing = await db.select().from(targets);
if (existing.length > 0) 
    return;

const get_all_habits = await db.select().from(habits);

for (const habit of get_all_habits) {
if (habit.name === 'Morning Run') {
    await db.insert(targets).values([{habit_id: habit.id, period: 'daily', amount: 1}]);
}
if (habit.name === 'Study') {
    await db.insert(targets).values([{habit_id: habit.id, period: 'weekly', amount: 10}]);
}
if (habit.name === 'meet friends') {
    await db.insert(targets).values([{habit_id: habit.id, period: 'monthly', amount: 8}]);
}
}}



export async function seedHabitLogsIfEmpty() {
const existing = await db.select().from(habit_logs);
if (existing.length > 0) 
    return;

const get_all_habits = await db.select().from(habits);

for (const habit of get_all_habits) {
if (habit.name === 'Morning Run') {
    await db.insert(habit_logs).values([
    {habit_id: habit.id, logged_at: daysAgo(0), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(1), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(2), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(4), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(5), value: 1},
]);}

if (habit.name === 'Study') {
    await db.insert(habit_logs).values([
    {habit_id: habit.id, logged_at: daysAgo(0), value: 2},
    {habit_id: habit.id, logged_at: daysAgo(1), value: 3},
    {habit_id: habit.id, logged_at: daysAgo(2), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(3), value: 2},
    {habit_id: habit.id, logged_at: daysAgo(5), value: 3},
    {habit_id: habit.id, logged_at: daysAgo(6), value: 1},
]);}

if (habit.name === 'meet friends') {
    await db.insert(habit_logs).values([
    {habit_id: habit.id, logged_at: daysAgo(1), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(4), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(8), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(12), value: 1},
    {habit_id: habit.id, logged_at: daysAgo(18), value: 1},
]);}
}}