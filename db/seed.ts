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
await db.insert(users).values([{username: 'Joe', password: 'password',},]); }



export async function seedCategoriesIfEmpty() {
const existing = await db.select().from(categories);
if (existing.length > 0) 
    return;

const [user] = await db.select().from(users);
if (!user)
    return;

await db.insert(categories).values([
{user_id: user.id, name: 'Health & Fitness', colour_id: 6},
{user_id: user.id, name: 'Productivity', colour_id: 10},
]);}



export async function seedHabitsIfEmpty() {
const existing = await db.select().from(habits);
    if (existing.length > 0) 
        return;

const [user] = await db.select().from(users);
    if (!user) return;

const Categories = await db.select().from(categories);
const health_category = Categories.find((c) => c.name === 'Health & Fitness');
const productivity_category = Categories.find((c) => c.name === 'Productivity');
if (!health_category || !productivity_category)
    return;

await db.insert(habits).values([{
    user_id: user.id,
    category_id: health_category.id,
    name: 'Morning Run',
    metric_type: 'count',
    icon_id: 2,
    created_at: new Date().toISOString(),},

    {
    user_id: user.id,
    category_id: productivity_category.id,
    name: 'Study',
    metric_type: 'duration',
    icon_id: 15,
    created_at: new Date().toISOString(),
},]);}



export async function seedTargetsIfEmpty() {
const existing = await db.select().from(targets);
if (existing.length > 0) 
    return;

const get_all_habits = await db.select().from(habits);
const run = get_all_habits.find((h) => h.name === 'Morning Run');
const study = get_all_habits.find((h) => h.name === 'Study');
if (!run || !study) 
    return;

await db.insert(targets).values([
    {habit_id: run.id, period: 'weekly', amount: 5},
    {habit_id: study.id, period: 'monthly', amount: 20},
]);}



export async function seedHabitLogsIfEmpty() {
const existing = await db.select().from(habit_logs);
if (existing.length > 0) 
    return;

const get_all_habits = await db.select().from(habits);
const run = get_all_habits.find((h) => h.name === 'Morning Run');
const study = get_all_habits.find((h) => h.name === 'Study');
if (!run || !study) 
    return;

await db.insert(habit_logs).values([
    {habit_id: run.id, logged_at: daysAgo(0), value: 1},
    {habit_id: run.id, logged_at: daysAgo(1), value: 1},
    {habit_id: run.id, logged_at: daysAgo(2), value: 2},
    {habit_id: run.id, logged_at: daysAgo(3), value: 1},
    {habit_id: run.id, logged_at: daysAgo(5), value: 1},
    {habit_id: run.id, logged_at: daysAgo(6), value: 1},
    {habit_id: study.id, logged_at: daysAgo(0), value: 2},
    {habit_id: study.id, logged_at: daysAgo(1), value: 3},
    {habit_id: study.id, logged_at: daysAgo(3), value: 2},
    {habit_id: study.id, logged_at: daysAgo(4), value: 1},
    {habit_id: study.id, logged_at: daysAgo(6), value: 3},
]);}