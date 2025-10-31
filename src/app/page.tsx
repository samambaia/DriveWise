'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase/config';
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
} from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, MinusCircle, Car, Settings as SettingsIcon, History, Edit, Trash2, ArrowLeft, MoreVertical, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// #region Components
const RevenueModal = ({ isOpen, onClose, activePeriodId, rideApps }: any) => {
  const [amount, setAmount] = useState('');
  const [categoryOrApp, setCategoryOrApp] = useState('');
  const [tripCount, setTripCount] = useState('1');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || !categoryOrApp) {
      setError('Amount and app are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'transactions'), {
        type: 'Revenue',
        amount: parseFloat(amount),
        categoryOrApp,
        tripCount: parseInt(tripCount, 10) || 1,
        periodId: activePeriodId,
        timestamp: serverTimestamp(),
      });
      onClose();
      setAmount('');
      setCategoryOrApp('');
      setTripCount('1');
      setError('');
    } catch (e) {
      console.error('Error adding revenue: ', e);
      setError('Failed to add revenue.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Trip (Revenue)</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4 py-4">
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-input" />
          <Select onValueChange={setCategoryOrApp} value={categoryOrApp}>
            <SelectTrigger><SelectValue placeholder="Select Ride App" /></SelectTrigger>
            <SelectContent>
              {rideApps.map((app: string) => (
                <SelectItem key={app} value={app}>{app}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Trip Count (optional)" value={tripCount} onChange={(e) => setTripCount(e.target.value)} className="bg-input" />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} variant="outline">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ExpenseModal = ({ isOpen, onClose, activePeriodId, categories }: any) => {
  const [amount, setAmount] = useState('');
  const [categoryOrApp, setCategoryOrApp] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || !categoryOrApp || !description) {
      setError('All fields are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'transactions'), {
        type: 'Expense',
        amount: parseFloat(amount),
        categoryOrApp,
        description,
        periodId: activePeriodId,
        timestamp: serverTimestamp(),
      });
      onClose();
      setAmount('');
      setCategoryOrApp('');
      setDescription('');
      setError('');
    } catch (e) {
      console.error('Error adding expense: ', e);
      setError('Failed to add expense.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Expense</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4 py-4">
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-input" />
          <Select onValueChange={setCategoryOrApp} value={categoryOrApp}>
            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-input" />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} variant="outline">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = ({ transactions, activePeriod, onOpenRevenue, onOpenExpense }: any) => {
  const { totalRevenue, totalExpenses, totalTrips } = useMemo(() => {
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
          <CardDescription>Your financial summary for the active period.</CardDescription>
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
              <CardTitle>Goal Progress</CardTitle>
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
        <Button onClick={onOpenRevenue} className="p-6 text-lg"><PlusCircle className="mr-2"/> Log Trip (Revenue)</Button>
        <Button onClick={onOpenExpense} variant="destructive" className="p-6 text-lg"><MinusCircle className="mr-2"/> Log Expense</Button>
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
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Settings = ({ categories, rideApps, activePeriod }: any) => {
    const [newCategory, setNewCategory] = useState('');
    const [newRideApp, setNewRideApp] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [targetBalance, setTargetBalance] = useState('');
    
    useEffect(() => {
        if (activePeriod) {
            setStartDate(activePeriod.startDate?.toDate().toISOString().split('T')[0] || '');
            setEndDate(activePeriod.endDate?.toDate().toISOString().split('T')[0] || '');
            setInitialBalance(activePeriod.initialBalance?.toString() || '');
            setTargetBalance(activePeriod.targetBalance?.toString() || '');
        }
    }, [activePeriod]);

    const handleAddCategory = async () => {
        if (newCategory.trim() === '') return;
        try {
            const settingsDoc = doc(db, 'settings', 'appData');
            await updateDoc(settingsDoc, { categories: [...categories, newCategory] });
            setNewCategory('');
        } catch (e) {
            console.error("Error adding category: ", e);
        }
    };
    
    const handleDeleteCategory = async (categoryToDelete: string) => {
        try {
            const settingsDoc = doc(db, 'settings', 'appData');
            await updateDoc(settingsDoc, { categories: categories.filter((c: string) => c !== categoryToDelete) });
        } catch (e) {
            console.error("Error deleting category: ", e);
        }
    };
    
    const handleAddRideApp = async () => {
        if (newRideApp.trim() === '') return;
        try {
            const settingsDoc = doc(db, 'settings', 'appData');
            await updateDoc(settingsDoc, { rideApps: [...rideApps, newRideApp] });
            setNewRideApp('');
        } catch (e) {
            console.error("Error adding ride app: ", e);
        }
    };

    const handleDeleteRideApp = async (appToDelete: string) => {
        try {
            const settingsDoc = doc(db, 'settings', 'appData');
            await updateDoc(settingsDoc, { rideApps: rideApps.filter((a: string) => a !== appToDelete) });
        } catch(e) {
            console.error("Error deleting ride app: ", e);
        }
    };

    const handleActivateNewPeriod = async () => {
        if (!startDate || !endDate || !initialBalance || !targetBalance) {
            alert("Please fill all period fields.");
            return;
        }

        try {
            // Deactivate current active period
            if (activePeriod) {
                const oldPeriodRef = doc(db, 'periods', activePeriod.id);
                await updateDoc(oldPeriodRef, { isActive: false });
            }

            // Create new active period
            await addDoc(collection(db, 'periods'), {
                startDate: Timestamp.fromDate(new Date(startDate)),
                endDate: Timestamp.fromDate(new Date(endDate)),
                initialBalance: parseFloat(initialBalance),
                targetBalance: parseFloat(targetBalance),
                isActive: true,
            });
            
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
                    <CardTitle>Period Configuration</CardTitle>
                    <CardDescription>{activePeriod ? 'Edit the current period or start a new one.' : 'Define a new period to start tracking.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
                        <Input type="number" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} placeholder="Initial Balance" />
                        <Input type="number" value={targetBalance} onChange={(e) => setTargetBalance(e.target.value)} placeholder="Target Balance" />
                    </div>
                    <Button onClick={handleActivateNewPeriod}>{activePeriod ? 'Activate New Period' : 'Activate Period'}</Button>
                    <p className="text-xs text-muted-foreground">Note: Activating a new period will archive the current one.</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New Category" />
                    <Button onClick={handleAddCategory}>Add</Button>
                  </div>
                  <ul className="space-y-2">
                    {categories.map((cat: string) => (
                      <li key={cat} className="flex justify-between items-center bg-input p-2 rounded-md">
                        <span>{cat}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat)}><Trash2 className="h-4 w-4"/></Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ride Apps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input value={newRideApp} onChange={e => setNewRideApp(e.target.value)} placeholder="New Ride App" />
                    <Button onClick={handleAddRideApp}>Add</Button>
                  </div>
                  <ul className="space-y-2">
                    {rideApps.map((app: string) => (
                      <li key={app} className="flex justify-between items-center bg-input p-2 rounded-md">
                        <span>{app}</span>
                         <Button variant="ghost" size="icon" onClick={() => handleDeleteRideApp(app)}><Trash2 className="h-4 w-4"/></Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
        </div>
    );
};

const History = ({ allPeriods }: any) => {
    const [selectedPeriodId, setSelectedPeriodId] = useState('');
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        if (allPeriods.length > 0 && !selectedPeriodId) {
            setSelectedPeriodId(allPeriods.find((p:any) => p.isActive)?.id || allPeriods[0].id);
        }
    }, [allPeriods, selectedPeriodId]);

    useEffect(() => {
        if (!selectedPeriodId) return;

        const q = query(collection(db, 'transactions'), where('periodId', '==', selectedPeriodId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newTransactions: any[] = [];
            querySnapshot.forEach((doc) => {
                newTransactions.push({ id: doc.id, ...doc.data() });
            });
            setTransactions(newTransactions.sort((a,b) => b.timestamp - a.timestamp));
        });

        return () => unsubscribe();
    }, [selectedPeriodId]);

    const { expenseData, tripData } = useMemo(() => {
        const expenseMap = new Map();
        const tripMap = new Map();

        transactions.forEach(t => {
            if (t.type === 'Expense') {
                expenseMap.set(t.categoryOrApp, (expenseMap.get(t.categoryOrApp) || 0) + t.amount);
            } else if (t.type === 'Revenue') {
                tripMap.set(t.categoryOrApp, (tripMap.get(t.categoryOrApp) || 0) + (t.tripCount || 1));
            }
        });

        return {
            expenseData: Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value })),
            tripData: Array.from(tripMap.entries()).map(([name, value]) => ({ name, value })),
        };
    }, [transactions]);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>History & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={setSelectedPeriodId} value={selectedPeriodId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                        <SelectContent>
                            {allPeriods.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {new Date(p.startDate?.toDate()).toLocaleDateString()} - {new Date(p.endDate?.toDate()).toLocaleDateString()} {p.isActive && '(Active)'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
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
                    <CardHeader><CardTitle>Trip Breakdown</CardTitle></CardHeader>
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
                <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-card-foreground/5 rounded-lg">
                                <div>
                                    <p className={`font-bold ${t.type === 'Revenue' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'Revenue' ? `+ ${formatCurrency(t.amount)}` : `- ${formatCurrency(t.amount)}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{t.categoryOrApp} {t.description && `- ${t.description}`}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{t.timestamp?.toDate().toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// #endregion Components

export default function IDriveApp() {
  const [view, setView] = useState('Home');
  
  const [categories, setCategories] = useState<string[]>([]);
  const [rideApps, setRideApps] = useState<string[]>([]);
  
  const [activePeriod, setActivePeriod] = useState<any>(null);
  const [allPeriods, setAllPeriods] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [isRevenueModalOpen, setRevenueModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  
  // Fetch settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'appData'), (doc) => {
        if (doc.exists()) {
            setCategories(doc.data().categories || []);
            setRideApps(doc.data().rideApps || []);
        }
    });
    return () => unsub();
  }, []);

  // Fetch all periods for History view
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'periods'), (snapshot) => {
        const periodsData: any[] = [];
        snapshot.forEach(doc => periodsData.push({ id: doc.id, ...doc.data() }));
        setAllPeriods(periodsData.sort((a,b) => b.startDate - a.startDate));
        const active = periodsData.find(p => p.isActive);
        setActivePeriod(active);
    });
    return () => unsub();
  }, []);

  // Fetch transactions for active period
  useEffect(() => {
    if (!activePeriod) {
        setTransactions([]);
        return;
    };

    const q = query(collection(db, 'transactions'), where('periodId', '==', activePeriod.id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trans: any[] = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans);
    });

    return () => unsubscribe();
  }, [activePeriod]);
  
  const renderView = () => {
    switch (view) {
      case 'Home':
        return <Dashboard 
            transactions={transactions} 
            activePeriod={activePeriod}
            onOpenRevenue={() => setRevenueModalOpen(true)}
            onOpenExpense={() => setExpenseModalOpen(true)}
        />;
      case 'Settings':
        return <Settings categories={categories} rideApps={rideApps} activePeriod={activePeriod} />;
      case 'History':
        return <History allPeriods={allPeriods} />;
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
            <h1 className="text-2xl font-bold">IDriveApp</h1>
          </div>
        </header>
        <main>
          {renderView()}
        </main>
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2">
            <Button variant={view === 'Home' ? "secondary" : "ghost"} onClick={() => setView('Home')} className="flex flex-col h-auto">
                <Car/>
                <span>Home</span>
            </Button>
            <Button variant={view === 'Settings' ? "secondary" : "ghost"} onClick={() => setView('Settings')} className="flex flex-col h-auto">
                <SettingsIcon/>
                <span>Settings</span>
            </Button>
            <Button variant={view === 'History' ? "secondary" : "ghost"} onClick={() => setView('History')} className="flex flex-col h-auto">
                <History/>
                <span>History</span>
            </Button>
        </nav>
        <div className="pb-20"></div> {/* padding for bottom nav */}
      </div>
      
      <RevenueModal 
        isOpen={isRevenueModalOpen} 
        onClose={() => setRevenueModalOpen(false)} 
        activePeriodId={activePeriod?.id}
        rideApps={rideApps}
      />
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        activePeriodId={activePeriod?.id}
        categories={categories}
      />
    </div>
  );
}