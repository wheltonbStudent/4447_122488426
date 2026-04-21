import { db } from '@/db/client';
import { categories, habits as habit_data, users } from '@/db/schema';
import { seedCategoriesIfEmpty, seedHabitLogsIfEmpty, seedHabitsIfEmpty, seedTargetsIfEmpty, seedUsersIfEmpty, } from '@/db/seed';
import { eq } from 'drizzle-orm';
import { Stack, useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';


export type Category = { id: number; user_id: number; name: string; colour_id: number;};

type CategoriesContextType = {categories: Category[];
setCategories: React.Dispatch<React.SetStateAction<Category[]>>;};


export const CategoriesContext = createContext<CategoriesContextType | null>(null);







export type Habit = {id: number; user_id: number; category_id: number; 
                     name: string; metric_type: string; icon_id: number;
                     created_at: string;
                    };

// habit construction ripped from sample project                    
type HabitsContextType = {habits: Habit[];
setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export const HabitsContext = createContext<HabitsContextType | null>(null);








// model of a logged in user kept in memory
type User = {id: number; username: string;};



type SessionContextType = { currentUser: User | null; // defines what the session context can pass to the rest of the app
      login: (username: string, password: string) => Promise<boolean>;
      register: (username: string, password: string) => Promise<boolean>;
      logout: () => void;
      deleteProfile: () => Promise<void>;
};



// creates the session context, null until a user logs in
export const SessionContext = createContext<SessionContextType | null>(null);


// redirects users to the correct screen based on login state after waiting for loads
function AuthHandler({ children }: { children: React.ReactNode }) {
const context = useContext(SessionContext);
const segments = useSegments();
const router = useRouter();
const [isReady, setIsReady] = useState(false);

useEffect(() => {setIsReady(true); }, []); // updates listener on render

useEffect(() => {
if (!isReady) return;
if (!context) return;

const onAuthScreen = segments[0] === '(auth)';
if (!context.currentUser && !onAuthScreen) {router.replace('/(auth)/login');} 

else if (context.currentUser && onAuthScreen) {router.replace('/(tabs)');}}, [isReady, context?.currentUser, segments]);
  return <>{children}</>;}


  
export default function RootLayout() {
const [currentUser, setCurrentUser] = useState<User | null>(null); // tracks which user is currently logged in
const [habits, setHabits] = useState<Habit[]>([]);
const [userCategories, setUserCategories] = useState<Category[]>([]);


// seed DB when app gets launched
useEffect(() => {
const load = async () => {
await seedUsersIfEmpty();
await seedCategoriesIfEmpty();
await seedHabitsIfEmpty();
await seedTargetsIfEmpty();
await seedHabitLogsIfEmpty();
};
    void load(); }, []);



// checks credentials against the database and logs the user in
const login = async (username: string, password: string): Promise<boolean> => {
const result = await db.select().from(users).where(eq(users.username, username));
const user = result[0];
if (!user || user.password !== password) return false;
    setCurrentUser({ id: user.id, username: user.username });
    // load in habits and categories on login
    const rows = await db.select().from(habit_data).where(eq(habit_data.user_id, user.id));
    setHabits(rows);
    const category_rows = await db.select().from(categories).where(eq(categories.user_id, user.id));
    setUserCategories(category_rows);
    return true;
};



// creates a new account and auto-creates starter categories & sets an empty habit state for use
const register = async (username: string, password: string): Promise<boolean> => {
const existing = await db.select().from(users).where(eq(users.username, username));
if (existing.length > 0) return false;
  
await db.insert(users).values({ username, password });
const newUser = await db.select().from(users).where(eq(users.username, username));
const user = newUser[0];


if (!user) return false;
  await db.insert(categories).values([
  {user_id: user.id, name: 'Health & Fitness', colour_id: 6},
  {user_id: user.id, name: 'Mindfulness', colour_id: 3},
  {user_id: user.id, name: 'Productivity', colour_id: 10},
]);
  setCurrentUser({ id: user.id, username: user.username });
  const rows = await db.select().from(habit_data).where(eq(habit_data.user_id, user.id));
  setHabits(rows);
  const category_rows = await db.select().from(categories).where(eq(categories.user_id, user.id));
  setUserCategories(category_rows);
  return true;
};



const logout = () => {setCurrentUser(null);};



// trigger the cascading delete for current active user
const deleteProfile = async () => {
if (!currentUser) return;
  await db.delete(users).where(eq(users.id, currentUser.id));
  setCurrentUser(null);
};



// wraps the app in session context and handles auth routing, 
// screenOption being set at this level just forces me to use manual back buttons or I might just be too sleep deprived for this ****
return (
<SessionContext.Provider value={{ currentUser, login, register, logout, deleteProfile }}>
<CategoriesContext.Provider value={{ categories: userCategories, setCategories: setUserCategories }}>
<HabitsContext.Provider value={{ habits, setHabits }}>
  
  <AuthHandler>
        
   <Stack screenOptions={{ headerShown: false }} />

  </AuthHandler>
</HabitsContext.Provider>
</CategoriesContext.Provider>
</SessionContext.Provider>
);
}
