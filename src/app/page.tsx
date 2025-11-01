

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirebase, useUser } from '@/firebase';
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
  writeBatch,
  orderBy,
  setDoc,
} from 'firebase/firestore';
import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, MinusCircle, Car, Settings as SettingsIcon, History as HistoryIcon, Edit, Trash2, ArrowLeft, MoreVertical, LogOut, CheckCircle, AlertTriangle, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { TransactionModal } from '@/components/TransactionModal';


// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// #region Components

const Dashboard = ({ transactions, activePeriod, onOpenRevenue, onOpenExpense }: any) => {
  const { totalRevenue, totalExpenses, totalTrips } = useMemo(() => {
    if (!transactions) return { totalRevenue: 0, totalExpenses: 0, totalTrips: 0 };
    return transactions.reduce(
      (acc: any, t: any) => {
        if (t.type === 'Revenue') {
          acc.totalRevenue += t.amount;
          acc.totalTrips += t.tripCount || 0;
        } else {
          acc.totalExpenses += t.amount;
        }
        return acc;
      },
      { totalRevenue: 0, totalExpenses: 0, totalTrips: 0 }
    );
  }, [transactions]);

  const currentBalance = (activePeriod?.initialBalance || 0) + totalRevenue - totalExpenses;
  const targetBalance = activePeriod?.targetBalance || 0;
  const initialBalance = activePeriod?.initialBalance || 0;

  const progress = targetBalance > initialBalance
      ? ((currentBalance - initialBalance) / (targetBalance - initialBalance)) * 100
      : 0;
      
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Seu resumo financeiro para o período.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <h2 className="text-sm text-muted-foreground">Saldo Atual</h2>
            <p className={`text-4xl font-bold ${currentBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {formatCurrency(currentBalance)}
            </p>
        </CardContent>
      </Card>
      
      {activePeriod && (
        <Card>
          <CardHeader>
              <CardTitle>Progresso da Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={Math.max(0, Math.min(100, progress))} className="w-full" />
            <div className="flex justify-between text-sm mt-2 text-muted-foreground">
              <span>{formatCurrency(initialBalance)}</span>
              <span className="font-bold">{Math.round(progress)}%</span>
              <span>{formatCurrency(targetBalance)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={onOpenRevenue} className="p-6 text-lg"><PlusCircle className="mr-2"/> Corrida (Receita)</Button>
        <Button onClick={onOpenExpense} variant="destructive" className="p-6 text-lg"><MinusCircle className="mr-2"/> Despesa</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTrips}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Settings = ({ categories, rideApps, activePeriod, userId }: any) => {
    const { firestore } = useFirebase();
    const [newCategory, setNewCategory] = useState('');
    const [newRideApp, setNewRideApp] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [initialBalance, setInitialBalance] = useState<number | undefined>(0);
    const [targetBalance, setTargetBalance] = useState<number | undefined>(0);
    
    useEffect(() => {
        if (activePeriod) {
            setStartDate(activePeriod.startDate?.toDate().toISOString().split('T')[0] || '');
            setEndDate(activePeriod.endDate?.toDate().toISOString().split('T')[0] || '');
            setInitialBalance(activePeriod.initialBalance || 0);
            setTargetBalance(activePeriod.targetBalance || 0);
        }
    }, [activePeriod]);

    const handleAddCategory = async () => {
        if (newCategory.trim() === '' || !firestore) return;
        try {
            const newCatRef = doc(collection(firestore, 'categories'));
            await setDoc(newCatRef, { id: newCatRef.id, name: newCategory });
            setNewCategory('');
        } catch (e) {
            console.error("Error adding category: ", e);
        }
    };
    
    const handleDeleteCategory = async (categoryId: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'categories', categoryId));
        } catch (e) {
            console.error("Error deleting category: ", e);
        }
    };
    
    const handleAddRideApp = async () => {
        if (newRideApp.trim() === '' || !firestore) return;
        try {
            const newAppRef = doc(collection(firestore, 'rideApps'));
            await setDoc(newAppRef, { id: newAppRef.id, name: newRideApp });
            setNewRideApp('');
        } catch (e) {
            console.error("Error adding ride app: ", e);
        }
    };

    const handleDeleteRideApp = async (appId: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'rideApps', appId));
        } catch(e) {
            console.error("Error deleting ride app: ", e);
        }
    };

    const handleActivateNewPeriod = async () => {
        if (!startDate || !endDate || initialBalance === undefined || targetBalance === undefined || !firestore || !userId) {
            alert("Please fill all period fields.");
            return;
        }

        try {
            const batch = writeBatch(firestore);

            // Deactivate current active period
            if (activePeriod) {
                const oldPeriodRef = doc(firestore, `users/${userId}/periods`, activePeriod.id);
                batch.update(oldPeriodRef, { isActive: false });
            }

            // Create new active period
            const newPeriodRef = doc(collection(firestore, `users/${userId}/periods`));
            batch.set(newPeriodRef, {
                id: newPeriodRef.id,
                startDate: Timestamp.fromDate(new Date(startDate)),
                endDate: Timestamp.fromDate(new Date(endDate)),
                initialBalance: initialBalance,
                targetBalance: targetBalance,
                isActive: true,
            });

            await batch.commit();
            alert("New period activated!");
            
        } catch (e) {
            console.error("Error activating new period: ", e);
            alert("Failed to activate new period.");
        }
    };
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Configuração Período</CardTitle>
                    <CardDescription>{activePeriod ? 'Edite o período atual ou comece um novo.' : 'Defina um novo período para iniciar o rastreamento.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
                        <CurrencyInput value={initialBalance || 0} onValueChange={(value) => setInitialBalance(value)} placeholder="Saldo Inicial" />
                        <CurrencyInput value={targetBalance || 0} onValueChange={(value) => setTargetBalance(value)} placeholder="Objetivo Período" />
                    </div>
                    <Button onClick={handleActivateNewPeriod}>{activePeriod ? 'Ativar Novo Período' : 'Ativar Período'}</Button>
                    <p className="text-xs text-muted-foreground">Nota: Ativar um novo período vai arquivar o atual.</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Categorias de Despesa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nova Categoria" />
                    <Button onClick={handleAddCategory}>Add</Button>
                  </div>
                  <ul className="space-y-2">
                    {categories && categories.map((cat: any) => (
                      <li key={cat.id} className="flex justify-between items-center bg-input p-2 rounded-md">
                        <span>{cat.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4"/></Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Apps de Corrida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input value={newRideApp} onChange={e => setNewRideApp(e.target.value)} placeholder="Novo App de Corrida" />
                    <Button onClick={handleAddRideApp}>Add</Button>
                  </div>
                  <ul className="space-y-2">
                    {rideApps && rideApps.map((app: any) => (
                      <li key={app.id} className="flex justify-between items-center bg-input p-2 rounded-md">
                        <span>{app.name}</span>
                         <Button variant="ghost" size="icon" onClick={() => handleDeleteRideApp(app.id)}><Trash2 className="h-4 w-4"/></Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
        </div>
    );
};

const History = ({ allPeriods, userId, categories, rideApps, onEditTransaction }: any) => {
    const { firestore } = useFirebase();
    const [selectedPeriodId, setSelectedPeriodId] = useState('');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionToDelete, setTransactionToDelete] = useState<any>(null);

    useEffect(() => {
        if (allPeriods && allPeriods.length > 0 && !selectedPeriodId) {
            setSelectedPeriodId(allPeriods.find((p:any) => p.isActive)?.id || allPeriods[0].id);
        }
    }, [allPeriods, selectedPeriodId]);

    useEffect(() => {
        if (!selectedPeriodId || !firestore || !userId) {
            setTransactions([]);
            return;
        }

        const q = query(collection(firestore, `users/${userId}/periods/${selectedPeriodId}/transactions`), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newTransactions: any[] = [];
            querySnapshot.forEach((doc) => {
                newTransactions.push({ id: doc.id, ...doc.data() });
            });
            setTransactions(newTransactions);
        });

        return () => unsubscribe();
    }, [selectedPeriodId, firestore, userId]);

    const handleDeleteTransaction = async () => {
        if (!transactionToDelete || !firestore || !userId) return;
        try {
            await deleteDoc(doc(firestore, `users/${userId}/periods/${transactionToDelete.periodId}/transactions`, transactionToDelete.id));
            setTransactionToDelete(null);
        } catch (error) {
            console.error("Error deleting transaction: ", error);
        }
    };
    
    const { expenseData, tripData } = useMemo(() => {
        if (!transactions || !categories || !rideApps) return { expenseData: [], tripData: [] };

        const expenseMap = new Map();
        const tripMap = new Map();

        transactions.forEach(t => {
            if (t.type === 'Expense') {
                const category = categories.find((c: any) => c.id === t.categoryOrAppId);
                const categoryName = category ? category.name : 'Unknown';
                expenseMap.set(categoryName, (expenseMap.get(categoryName) || 0) + t.amount);
            } else if (t.type === 'Revenue') {
                const app = rideApps.find((a: any) => a.id === t.categoryOrAppId);
                const appName = app ? app.name : 'Unknown';
                tripMap.set(appName, (tripMap.get(appName) || 0) + (t.tripCount || 1));
            }
        });

        return {
            expenseData: Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value })),
            tripData: Array.from(tripMap.entries()).map(([name, value]) => ({ name, value })),
        };
    }, [transactions, categories, rideApps]);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Análise & Histórico</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={setSelectedPeriodId} value={selectedPeriodId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um período" />
                        </SelectTrigger>
                        <SelectContent>
                            {allPeriods && allPeriods.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {new Date(p.startDate?.toDate()).toLocaleDateString()} - {new Date(p.endDate?.toDate()).toLocaleDateString()} {p.isActive && '(Ativo)'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Detalhamento Despesa</CardTitle></CardHeader>
                    <CardContent>
                        {expenseData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                        {expenseData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value:any) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <p>No expense data for this period.</p>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Detalhamento Corridas</CardTitle></CardHeader>
                    <CardContent>
                        {tripData.length > 0 ? (
                           <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={tripData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#82ca9d" name="Trips" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <p>No trip data for this period.</p>}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader><CardTitle>Lançamentos</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {transactions && transactions.map(t => {
                            const detailName = t.type === 'Revenue'
                                ? rideApps.find((app: any) => app.id === t.categoryOrAppId)?.name
                                : categories.find((cat: any) => cat.id === t.categoryOrAppId)?.name;
                            
                            const fullDescription = t.type === 'Expense' 
                                ? `${detailName || 'Categoria'} - ${t.description}` 
                                : detailName || 'Receita';

                            return (
                                <div key={t.id} className="flex justify-between items-center p-3 bg-card-foreground/5 rounded-lg">
                                    <div className="flex-1">
                                        <p className={`font-bold ${t.type === 'Revenue' ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.type === 'Revenue' ? `+ ${formatCurrency(t.amount)}` : `- ${formatCurrency(t.amount)}`}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{fullDescription}</p>
                                        <p className="text-xs text-muted-foreground">{t.timestamp?.toDate().toLocaleString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEditTransaction(t)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTransactionToDelete(t)} className="text-red-500 focus:text-red-500">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the transaction.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTransaction} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const LoginScreen = () => {
  const { auth } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuthAction = async () => {
    if (!auth || !email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      setError(e.message);
      console.error("Authentication error:", e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
      <Card className="p-8 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{isSignUp ? 'Create Account' : 'Welcome Back'}</CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? 'Enter your email and password to sign up.' : 'Sign in to track your trips and finances.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleAuthAction} className="w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button variant="link" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="w-full">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


// #endregion Components

export default function IDriveApp() {
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [view, setView] = useState('Home');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [rideApps, setRideApps] = useState<any[]>([]);
  
  const [activePeriod, setActivePeriod] = useState<any>(null);
  const [allPeriods, setAllPeriods] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);
  const [newTransactionType, setNewTransactionType] = useState<'Revenue' | 'Expense' | null>(null);

  const handleOpenNewTransaction = (type: 'Revenue' | 'Expense') => {
    setTransactionToEdit(null);
    setNewTransactionType(type);
    setTransactionModalOpen(true);
  };
  
  const handleEditTransaction = (transaction: any) => {
    setNewTransactionType(null);
    setTransactionToEdit(transaction);
    setTransactionModalOpen(true);
  };
  
  const handleCloseTransactionModal = () => {
    setTransactionModalOpen(false);
    setTransactionToEdit(null);
    setNewTransactionType(null);
  };

  const handleSignOut = () => {
    if (auth) {
      signOut(auth);
    }
  };
  
  // Fetch settings (Categories and RideApps)
  useEffect(() => {
    if (!firestore) return;
    const catUnsub = onSnapshot(collection(firestore, 'categories'), (snapshot) => {
        const catData: any[] = [];
        snapshot.forEach(doc => catData.push({ id: doc.id, ...doc.data() }));
        setCategories(catData);
    });
    const appUnsub = onSnapshot(collection(firestore, 'rideApps'), (snapshot) => {
        const appData: any[] = [];
        snapshot.forEach(doc => appData.push({ id: doc.id, ...doc.data() }));
        setRideApps(appData);
    });
    return () => {
      catUnsub();
      appUnsub();
    };
  }, [firestore]);

  // Fetch all periods for the current user
  useEffect(() => {
    if (!firestore || !user) {
        setAllPeriods([]);
        setActivePeriod(null);
        return;
    };
    const periodsRef = collection(firestore, `users/${user.uid}/periods`);
    const q = query(periodsRef, orderBy('startDate', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
        const periodsData: any[] = [];
        snapshot.forEach(doc => periodsData.push({ id: doc.id, ...doc.data() }));
        setAllPeriods(periodsData);
        const active = periodsData.find(p => p.isActive);
        setActivePeriod(active);
    });
    return () => unsub();
  }, [firestore, user]);

  // Fetch transactions for active period
  useEffect(() => {
    if (!activePeriod || !firestore || !user) {
        setTransactions([]);
        return;
    };

    const q = query(collection(firestore, `users/${user.uid}/periods/${activePeriod.id}/transactions`), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trans: any[] = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans);
    });

    return () => unsubscribe();
  }, [activePeriod, firestore, user]);
  
  if (isUserLoading) {
      return (
        <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center">
            <div>Loading...</div>
        </div>
      )
  }

  if (!user) {
      return (
         <div className="min-h-screen bg-background text-foreground dark">
            <LoginScreen />
         </div>
      )
  }

  const renderView = () => {
    switch (view) {
      case 'Home':
        return <Dashboard 
            transactions={transactions} 
            activePeriod={activePeriod}
            onOpenRevenue={() => handleOpenNewTransaction('Revenue')}
            onOpenExpense={() => handleOpenNewTransaction('Expense')}
        />;
      case 'Settings':
        return <Settings categories={categories} rideApps={rideApps} activePeriod={activePeriod} userId={user.uid} />;
      case 'History':
        return <History 
            allPeriods={allPeriods} 
            userId={user.uid} 
            categories={categories} 
            rideApps={rideApps}
            onEditTransaction={handleEditTransaction}
        />;
      default:
        return <Dashboard transactions={[]} activePeriod={null} onOpenRevenue={() => {}} onOpenExpense={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <div className="container mx-auto p-4 max-w-4xl">
        <header className="flex justify-between items-center py-4 mb-6">
          <div className="flex items-center gap-2">
            <Car className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">DriveWise</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback><UserIcon/></AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                    {user.displayName && <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                    </p>}
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </header>
        {renderView()}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2">
            <Button variant={view === 'Home' ? "secondary" : "ghost"} onClick={() => setView('Home')} className="flex flex-col h-auto">
                <Car/>
                <span>Principal</span>
            </Button>
            <Button variant={view === 'Settings' ? "secondary" : "ghost"} onClick={() => setView('Settings')} className="flex flex-col h-auto">
                <SettingsIcon/>
                <span>Configurações</span>
            </Button>
            <Button variant={view === 'History' ? "secondary" : "ghost"} onClick={() => setView('History')} className="flex flex-col h-auto">
                <HistoryIcon/>
                <span>Histórico</span>
            </Button>
        </nav>
        <div className="pb-20"></div> {/* padding for bottom nav */}
      </div>
      
      {isTransactionModalOpen && (
        <TransactionModal 
          isOpen={isTransactionModalOpen} 
          onClose={handleCloseTransactionModal} 
          transaction={transactionToEdit}
          periodId={activePeriod?.id}
          userId={user.uid}
          categories={categories}
          rideApps={rideApps}
          defaultType={newTransactionType}
        />
      )}
    </div>
  );
}

    
