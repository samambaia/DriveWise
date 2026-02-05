
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { DriveWiseIcon } from '@/components/DriveWiseLogo';

// Type Definitions
interface Category {
  id: string;
  name: string;
}

interface RideApp {
  id: string;
  name: string;
}

interface Period {
  id: string;
  startDate: any;
  endDate: any;
  initialBalance: number;
  targetBalance: number;
  isActive: boolean;
}

interface Transaction {
  id: string;
  type: 'Revenue' | 'Expense';
  amount: number;
  categoryOrAppId: string;
  description?: string;
  tripCount?: number;
  timestamp: any;
  periodId: string;
}

type Theme = 'light' | 'dark';
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
  getDoc,
  Timestamp,
  serverTimestamp,
  writeBatch,
  orderBy,
  setDoc,
  collectionGroup,
  limit,
} from 'firebase/firestore';
import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, MinusCircle, Settings as SettingsIcon, History as HistoryIcon, Edit, Trash2, ArrowLeft, MoreVertical, LogOut, CheckCircle, AlertTriangle, User as UserIcon, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';


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
      <Card className="gradient-primary text-primary-foreground rounded-2xl elevation-3 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription className="text-primary-foreground/80">Seu resumo financeiro para o período</CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <h2 className="text-sm text-primary-foreground/80 mb-4">Saldo Atual</h2>
          <p className="text-5xl font-bold mb-2">
            {formatCurrency(currentBalance)}
          </p>
        </CardContent>
      </Card>

      {activePeriod && (
        <Card className="rounded-2xl elevation-2 bg-gradient-to-br from-card to-primary-container/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Progresso da Meta</CardTitle>
              <CardDescription>Seu progresso até o objetivo</CardDescription>
            </div>
            <div className="h-16 w-16 relative">
              <svg className="h-16 w-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (175.93 * Math.max(0, Math.min(100, progress)) / 100)}
                  className="text-primary transition-all duration-1000 ease-out" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={Math.max(0, Math.min(100, progress))} className="w-full h-2" />
            <div className="flex justify-between text-sm mt-4 text-muted-foreground">
              <span className="font-medium">{formatCurrency(initialBalance)}</span>
              <span className="font-medium">{formatCurrency(targetBalance)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={onOpenRevenue} className="p-6 text-lg gradient-success elevation-2 rounded-2xl hover:elevation-3 transition-all">
          <PlusCircle className="mr-2 h-5 w-5" /> Receita
        </Button>
        <Button onClick={onOpenExpense} className="p-6 text-lg gradient-error elevation-2 rounded-2xl hover:elevation-3 transition-all">
          <MinusCircle className="mr-2 h-5 w-5" /> Despesa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl elevation-1 bg-gradient-to-br from-card to-primary-container/20 hover:elevation-2 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{totalTrips}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl elevation-1 bg-gradient-to-br from-card to-success/20 hover:elevation-2 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-success">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl elevation-1 bg-gradient-to-br from-card to-error/20 hover:elevation-2 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-error">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Settings = ({ categories, rideApps, activePeriod, userId, onCategoryDeleted, onRideAppDeleted, theme, onThemeChange }: any) => {
  const { firestore, auth } = useFirebase();
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState('');
  const [newRideApp, setNewRideApp] = useState('');
  const [isSavingPeriod, setIsSavingPeriod] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [rideAppToDelete, setRideAppToDelete] = useState<RideApp | null>(null);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [categoryUsageCounts, setCategoryUsageCounts] = useState<Record<string, number>>({});
  const [rideAppUsageCounts, setRideAppUsageCounts] = useState<Record<string, number>>({});

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialBalance, setInitialBalance] = useState<number | undefined>(0);
  const [targetBalance, setTargetBalance] = useState<number | undefined>(0);

  const toLocalDateString = (date: Date | null | undefined) => {
    if (!date) return '';
    // Adjust for timezone offset before converting to ISO string
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return adjustedDate.toISOString().split('T')[0];
  }

  useEffect(() => {
    if (activePeriod) {
      setStartDate(toLocalDateString(activePeriod.startDate?.toDate()));
      setEndDate(toLocalDateString(activePeriod.endDate?.toDate()));
      setInitialBalance(activePeriod.initialBalance || 0);
      setTargetBalance(activePeriod.targetBalance || 0);
    } else {
      // If there's no active period, clear the fields
      setStartDate('');
      setEndDate('');
      setInitialBalance(0);
      setTargetBalance(0);
    }
  }, [activePeriod]);

  // Calculate usage counts for categories and ride apps
  useEffect(() => {
    if (!firestore || !userId) return;

    const calculateUsage = async () => {
      try {
        const periodsSnapshot = await getDocs(collection(firestore, `users/${userId}/periods`));
        const catCounts: Record<string, number> = {};
        const appCounts: Record<string, number> = {};

        for (const periodDoc of periodsSnapshot.docs) {
          const transactionsSnapshot = await getDocs(
            collection(firestore, `users/${userId}/periods/${periodDoc.id}/transactions`)
          );

          transactionsSnapshot.forEach(transactionDoc => {
            const data = transactionDoc.data();
            if (data.type === 'Expense') {
              catCounts[data.categoryOrAppId] = (catCounts[data.categoryOrAppId] || 0) + 1;
            } else if (data.type === 'Revenue') {
              appCounts[data.categoryOrAppId] = (appCounts[data.categoryOrAppId] || 0) + 1;
            }
          });
        }

        setCategoryUsageCounts(catCounts);
        setRideAppUsageCounts(appCounts);
      } catch (error) {
        console.error('Error calculating usage:', error);
      }
    };

    calculateUsage();
  }, [firestore, userId, categories, rideApps]);


  const handleAddCategory = async () => {
    if (newCategory.trim() === '' || !firestore) return;

    const isDuplicate = categories.some(
      (cat: any) => cat.name.trim().toLowerCase() === newCategory.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Categoria Duplicada",
        description: "Esta categoria já existe.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCatRef = doc(collection(firestore, 'categories'));
      await setDoc(newCatRef, { id: newCatRef.id, name: newCategory });
      setNewCategory('');
      toast({ title: "Categoria Adicionada", description: `"${newCategory}" foi adicionado.` });
    } catch (e) {
      console.error("Error adding category: ", e);
      toast({ title: "Erro", description: "Não foi possível adicionar a categoria.", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!firestore || !userId) return;

    // First, check if category is being used
    setIsCheckingUsage(true);
    try {
      const periodsSnapshot = await getDocs(collection(firestore, `users/${userId}/periods`));
      let count = 0;

      for (const periodDoc of periodsSnapshot.docs) {
        const transactionsQuery = query(
          collection(firestore, `users/${userId}/periods/${periodDoc.id}/transactions`),
          where('categoryOrAppId', '==', categoryId),
          where('type', '==', 'Expense')
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        count += transactionsSnapshot.size;
      }

      setUsageCount(count);
      const category = categories.find((c: Category) => c.id === categoryId);
      setCategoryToDelete(category || null);
    } catch (e) {
      console.error('Error checking category usage:', e);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o uso da categoria.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingUsage(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!firestore || !categoryToDelete) return;
    try {
      console.log('Attempting to delete category:', categoryToDelete.id);
      await deleteDoc(doc(firestore, 'categories', categoryToDelete.id));
      console.log('Category deleted successfully');

      // Notify parent component to update state
      if (onCategoryDeleted) {
        onCategoryDeleted(categoryToDelete.id);
      }

      toast({
        title: "Categoria Deletada",
        description: `"${categoryToDelete.name}" foi removida com sucesso.`
      });
    } catch (e) {
      console.error("Error deleting category: ", e);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a categoria. Verifique as permissões do Firestore.",
        variant: "destructive"
      });
    } finally {
      setCategoryToDelete(null);
      setUsageCount(0);
    }
  };

  const handleAddRideApp = async () => {
    if (newRideApp.trim() === '' || !firestore) return;

    const isDuplicate = rideApps.some(
      (app: any) => app.name.trim().toLowerCase() === newRideApp.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "App de Corrida Duplicado",
        description: "Este app de corrida já existe.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAppRef = doc(collection(firestore, 'rideApps'));
      await setDoc(newAppRef, { id: newAppRef.id, name: newRideApp });
      setNewRideApp('');
      toast({ title: "App de Corrida Adicionado", description: `"${newRideApp}" foi adicionado.` });
    } catch (e) {
      console.error("Error adding ride app: ", e);
      toast({ title: "Erro", description: "Não foi possível adicionar o app de corrida.", variant: "destructive" });
    }
  };

  const handleDeleteRideApp = async (appId: string) => {
    if (!firestore || !userId) return;

    // First, check if ride app is being used
    setIsCheckingUsage(true);
    try {
      const periodsSnapshot = await getDocs(collection(firestore, `users/${userId}/periods`));
      let count = 0;

      for (const periodDoc of periodsSnapshot.docs) {
        const transactionsQuery = query(
          collection(firestore, `users/${userId}/periods/${periodDoc.id}/transactions`),
          where('categoryOrAppId', '==', appId),
          where('type', '==', 'Revenue')
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        count += transactionsSnapshot.size;
      }

      setUsageCount(count);
      const app = rideApps.find((a: RideApp) => a.id === appId);
      setRideAppToDelete(app || null);
    } catch (e) {
      console.error('Error checking ride app usage:', e);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o uso do app de corrida.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingUsage(false);
    }
  };

  const confirmDeleteRideApp = async () => {
    if (!firestore || !rideAppToDelete) return;

    try {
      const docRef = doc(firestore, 'rideApps', rideAppToDelete.id);
      await deleteDoc(docRef);

      // Notify parent component to update state
      if (onRideAppDeleted) {
        onRideAppDeleted(rideAppToDelete.id);
      }

      toast({
        title: "App de Corrida Deletado",
        description: `"${rideAppToDelete.name}" foi removido com sucesso.`
      });
    } catch (e: any) {
      console.error("Error deleting ride app:", e);
      toast({
        title: "Erro",
        description: `Não foi possível deletar: ${e.code || e.message}`,
        variant: "destructive"
      });
    } finally {
      setRideAppToDelete(null);
      setUsageCount(0);
    }
  };

  const handleActivateNewPeriod = async () => {
    if (!startDate || !endDate || initialBalance === undefined || targetBalance === undefined || !firestore || !userId) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, preencha todos os campos do período.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPeriod(true);

    try {
      const batch = writeBatch(firestore);

      // Deactivate all existing periods for the user
      const periodsQuery = query(collection(firestore, `users/${userId}/periods`), where("isActive", "==", true));
      const activePeriodsSnapshot = await getDocs(periodsQuery);
      activePeriodsSnapshot.forEach(periodDoc => {
        batch.update(periodDoc.ref, { isActive: false });
      });

      const newPeriodRef = doc(collection(firestore, `users/${userId}/periods`));

      const startTimestamp = Timestamp.fromDate(new Date(`${startDate}T00:00:00`));
      const endTimestamp = Timestamp.fromDate(new Date(`${endDate}T23:59:59`));

      batch.set(newPeriodRef, {
        id: newPeriodRef.id,
        startDate: startTimestamp,
        endDate: endTimestamp,
        initialBalance: initialBalance,
        targetBalance: targetBalance,
        isActive: true,
      });

      await batch.commit();
      toast({
        title: "Período Ativado!",
        description: "O novo período foi iniciado com sucesso."
      });

    } catch (e) {
      console.error("Error activating new period: ", e);
      toast({
        title: "Erro ao Ativar Período",
        description: "Ocorreu um erro ao salvar o novo período. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPeriod(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl elevation-1">
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Personalize a aparência da aplicação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
            <div className="flex items-center gap-4">
              {theme === 'dark' ? (
                <div className="p-3 rounded-full bg-primary/20">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
              ) : (
                <div className="p-3 rounded-full bg-tertiary/20">
                  <Sun className="h-6 w-6 text-tertiary" />
                </div>
              )}
              <div>
                <p className="font-medium text-lg">Tema {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Reduz o brilho da tela' : 'Interface com mais luz'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Sun className="h-5 w-5 text-muted-foreground" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                className="scale-110"
              />
              <Moon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl elevation-2">
        <CardHeader>
          <CardTitle>Configuração Período</CardTitle>
          <CardDescription>{activePeriod ? 'Edite o período atual ou comece um novo.' : 'Defina um novo período para iniciar o rastreamento.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-base font-medium">Período</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl" />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialBalance" className="text-base font-medium">Saldo Inicial</Label>
              <CurrencyInput id="initialBalance" value={initialBalance || 0} onValueChange={(value) => setInitialBalance(value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetBalance" className="text-base font-medium">Objetivo do Período</Label>
              <CurrencyInput id="targetBalance" value={targetBalance || 0} onValueChange={(value) => setTargetBalance(value)} className="rounded-xl" />
            </div>
          </div>
          <Button onClick={handleActivateNewPeriod} disabled={isSavingPeriod} className="w-full rounded-xl py-6 gradient-primary elevation-2 hover:elevation-3 transition-all text-base">
            {isSavingPeriod ? 'Salvando...' : (activePeriod ? 'Ativar Novo Período' : 'Ativar Período')}
          </Button>
          <p className="text-xs text-muted-foreground text-center">Nota: Ativar um novo período vai arquivar o atual.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl elevation-1">
          <CardHeader>
            <CardTitle>Categorias de Despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-6">
              <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nova Categoria" className="rounded-xl" />
              <Button onClick={handleAddCategory} className="rounded-xl px-6">Add</Button>
            </div>
            <ul className="space-y-3">
              {categories && categories.map((cat: Category) => (
                <li key={cat.id} className="flex justify-between items-center p-3 bg-accent/50 rounded-xl group hover:bg-accent transition-all">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{cat.name}</span>
                    {categoryUsageCounts[cat.id] > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full">
                        {categoryUsageCounts[cat.id]} uso{categoryUsageCounts[cat.id] !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(cat.id)}
                    disabled={isCheckingUsage}
                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-error-foreground rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl elevation-1">
          <CardHeader>
            <CardTitle>Apps de Corrida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-6">
              <Input value={newRideApp} onChange={e => setNewRideApp(e.target.value)} placeholder="Novo App de Corrida" className="rounded-xl" />
              <Button onClick={handleAddRideApp} className="rounded-xl px-6">Add</Button>
            </div>
            <ul className="space-y-3">
              {rideApps && rideApps.map((app: RideApp) => (
                <li key={app.id} className="flex justify-between items-center p-3 bg-accent/50 rounded-xl group hover:bg-accent transition-all">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{app.name}</span>
                    {rideAppUsageCounts[app.id] > 0 && (
                      <span className="text-xs bg-secondary/20 text-secondary px-2.5 py-1 rounded-full">
                        {rideAppUsageCounts[app.id]} uso{rideAppUsageCounts[app.id] !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRideApp(app.id)}
                    disabled={isCheckingUsage}
                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-error-foreground rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog for Category Deletion */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              {usageCount > 0 ? (
                <>
                  <span className="text-warning font-semibold">Atenção:</span> A categoria "{categoryToDelete?.name}" está sendo usada em <span className="font-bold">{usageCount}</span> transação{usageCount !== 1 ? 'ões' : ''}.
                  <br /><br />
                  Ao deletar esta categoria, as transações associadas exibirão "Desconhecido" como categoria.
                  <br /><br />
                  Tem certeza que deseja continuar?
                </>
              ) : (
                `Tem certeza que deseja deletar a categoria "${categoryToDelete?.name}"? Esta ação não pode ser desfeita.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCategory}
              className="rounded-xl bg-error hover:bg-error/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for RideApp Deletion */}
      <AlertDialog open={!!rideAppToDelete} onOpenChange={() => setRideAppToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar App de Corrida?</AlertDialogTitle>
            <AlertDialogDescription>
              {usageCount > 0 ? (
                <>
                  <span className="text-warning font-semibold">Atenção:</span> O app "{rideAppToDelete?.name}" está sendo usado em <span className="font-bold">{usageCount}</span> transação{usageCount !== 1 ? 'ões' : ''}.
                  <br /><br />
                  Ao deletar este app, as transações associadas exibirão "Desconhecido" como app.
                  <br /><br />
                  Tem certeza que deseja continuar?
                </>
              ) : (
                `Tem certeza que deseja deletar o app "${rideAppToDelete?.name}"? Esta ação não pode ser desfeita.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRideApp}
              className="rounded-xl bg-error hover:bg-error/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const History = ({ allPeriods, userId, categories, rideApps, onEditTransaction }: any) => {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);

  useEffect(() => {
    if (allPeriods && allPeriods.length > 0 && !selectedPeriodId) {
      setSelectedPeriodId(allPeriods.find((p: any) => p.isActive)?.id || allPeriods[0].id);
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
      toast({
        title: "Transação Deletada",
        description: "A transação foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting transaction: ", error);
      toast({
        title: "Falha na Deleção",
        description: "Não foi possível deletar a transação. Verifique as regras de segurança do Firestore.",
        variant: "destructive",
      });
    } finally {
      setTransactionToDelete(null);
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

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];


  return (
    <div className="space-y-6">
      <Card className="rounded-2xl elevation-1">
        <CardHeader>
          <CardTitle>Análise & Histórico</CardTitle>
          <CardDescription>Visualize suas transações e métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedPeriodId} value={selectedPeriodId}>
            <SelectTrigger className="rounded-xl">
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
        <Card className="rounded-2xl elevation-1">
          <CardHeader><CardTitle className="text-lg">Detalhamento Despesa</CardTitle></CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-8">Nenhuma despesa no período.</p>}
          </CardContent>
        </Card>
        <Card className="rounded-2xl elevation-1">
          <CardHeader><CardTitle className="text-lg">Detalhamento Corridas</CardTitle></CardHeader>
          <CardContent>
            {tripData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tripData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--secondary))" name="Trips" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-8">Nenhuma corrida no período.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl elevation-1">
        <CardHeader><CardTitle className="text-lg">Lançamentos</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions && transactions.map(t => {
              const detailName = t.type === 'Revenue'
                ? rideApps.find((app: RideApp) => app.id === t.categoryOrAppId)?.name
                : categories.find((cat: Category) => cat.id === t.categoryOrAppId)?.name;

              const fullDescription = t.type === 'Expense'
                ? `${detailName || 'Desconhecido'} - ${t.description}`
                : detailName || 'Desconhecido';

              return (
                <div key={t.id} className="flex justify-between items-center p-4 bg-accent/50 rounded-xl hover:bg-accent transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {t.type === 'Revenue' ? (
                        <div className="p-2 rounded-full bg-success/20">
                          <PlusCircle className="h-5 w-5 text-success" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-error/20">
                          <MinusCircle className="h-5 w-5 text-error" />
                        </div>
                      )}
                      <p className={`font-bold text-lg ${t.type === 'Revenue' ? 'text-success' : 'text-error'}`}>
                        {t.type === 'Revenue' ? `+ ${formatCurrency(t.amount)}` : `- ${formatCurrency(t.amount)}`}
                      </p>
                    </div>
                    <p className="text-sm text-foreground ml-8">{fullDescription}</p>
                    <p className="text-xs text-muted-foreground ml-8">{t.timestamp?.toDate().toLocaleDateString('pt-BR')} às {t.timestamp?.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTransaction(t)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTransactionToDelete(t)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Deletar</span>
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
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá apagar definitivamente a transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction} className="rounded-xl bg-error hover:bg-error/90">Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ForgotPasswordDialog = ({ isOpen, onOpenChange, onSendResetEmail }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onSendResetEmail: (email: string) => void }) => {
  const [email, setEmail] = useState('');

  const handleSendClick = () => {
    onSendResetEmail(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Recuperar Senha</DialogTitle>
          <DialogDescription>
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
          <Button onClick={handleSendClick} className="rounded-xl gradient-primary">Enviar Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LoginScreen = () => {
  const { auth } = useFirebase();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleAuthAction = async () => {
    if (!auth || !email || !password) {
      setError("Por favor, entre com o e-mail e senha.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("As senhas não coincidem.");
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
      console.error("Authentication error:", e);
      // Provide user-friendly error messages
      if (e.code === 'auth/invalid-credential') {
        setError("Email ou senha incorretos. Verifique suas credenciais.");
      } else if (e.code === 'auth/user-not-found') {
        setError("Usuário não encontrado. Cadastre-se primeiro.");
      } else if (e.code === 'auth/wrong-password') {
        setError("Senha incorreta. Tente novamente.");
      } else if (e.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso. Faça login ou use outro email.");
      } else if (e.code === 'auth/weak-password') {
        setError("Senha muito fraca. Use pelo menos 6 caracteres.");
      } else if (e.code === 'auth/invalid-email') {
        setError("Email inválido. Verifique o formato.");
      } else {
        setError("Erro ao autenticar. Tente novamente.");
      }
    }
  };

  const handlePasswordReset = async (resetEmail: string) => {
    if (!auth || !resetEmail) {
      toast({
        title: "Email Necessário",
        description: "Por favor, digite seu endereço de e-mail.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: "Link Enviado",
        description: "Verifique sua caixa de entrada para o link de redefinição de senha.",
      });
      setIsForgotPasswordOpen(false);
    } catch (e: any) {
      toast({
        title: "Erro",
        description: e.message,
        variant: "destructive",
      });
      console.error("Password reset error:", e);
    }
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen -mt-20 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary elevation-3 mb-4">
              <img src="/icon.png" alt="DriveWise" className="h-12 w-12 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold mb-2">DriveWise</h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'Crie sua conta para começar' : 'Faça login para acompanhar suas viagens e finanças'}
            </p>
          </div>

          <Card className="rounded-2xl elevation-2">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{isSignUp ? 'Criar Conta' : 'Bem vindo de Volta'}</CardTitle>
              <CardDescription className="text-center">
                {isSignUp ? 'Entre com seu e-mail e senha para se registrar.' : 'Acesse sua conta para continuar'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-error/10 text-error rounded-xl text-sm text-center">{error}</div>}
              <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {isSignUp && (
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              )}
              <Button onClick={handleAuthAction} className="w-full rounded-xl py-6 gradient-primary elevation-2 hover:elevation-3 transition-all text-base">
                {isSignUp ? 'Cadastre-se' : 'Entrar'}
              </Button>

              {!isSignUp && (
                <Button variant="link" onClick={() => setIsForgotPasswordOpen(true)} className="w-full text-sm">
                  Esqueci minha senha
                </Button>
              )}

              <div className="pt-2 border-t">
                <Button variant="ghost" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="w-full">
                  {isSignUp ? 'Já tem uma conta? Faça login' : "Ainda não tem uma conta? Cadastre-se."}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ForgotPasswordDialog
        isOpen={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
        onSendResetEmail={handlePasswordReset}
      />
    </>
  );
};


// #endregion Components

export default function IDriveApp() {
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { theme, setTheme } = useTheme();
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

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Fetch settings (Categories and RideApps)
  useEffect(() => {
    if (!firestore) return;

    const catUnsub = onSnapshot(
      collection(firestore, 'categories'),
      (snapshot) => {
        const catData: any[] = [];
        snapshot.forEach(doc => {
          const { id: _, ...data } = doc.data();
          catData.push({ id: doc.id, ...data });
        });
        catData.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(catData);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    const appUnsub = onSnapshot(
      collection(firestore, 'rideApps'),
      (snapshot) => {
        const appData: any[] = [];
        snapshot.forEach(doc => {
          const { id: _, ...data } = doc.data();
          appData.push({ id: doc.id, ...data });
        });
        appData.sort((a, b) => a.name.localeCompare(b.name));
        setRideApps(appData);
      },
      (error) => {
        console.error('Error fetching ride apps:', error);
      }
    );

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
        return <Settings
          categories={categories}
          rideApps={rideApps}
          activePeriod={activePeriod}
          userId={user.uid}
          onCategoryDeleted={(id: string) => setCategories(prev => prev.filter(cat => cat.id !== id))}
          onRideAppDeleted={(id: string) => setRideApps(prev => prev.filter(app => app.id !== id))}
          theme={theme}
          onThemeChange={handleThemeChange}
        />;
      case 'History':
        return <History
          allPeriods={allPeriods}
          userId={user.uid}
          categories={categories}
          rideApps={rideApps}
          onEditTransaction={handleEditTransaction}
        />;
      default:
        return <Dashboard transactions={[]} activePeriod={null} onOpenRevenue={() => { }} onOpenExpense={() => { }} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 max-w-4xl">
        <header className="flex justify-between items-center py-4 mb-6">
          <div className="flex items-center gap-2">
            <DriveWiseIcon className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-bold">DriveWise</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback><UserIcon /></AvatarFallback>
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
          </div>
        </header>
        {renderView()}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2">
          <Button variant={view === 'Home' ? "secondary" : "ghost"} onClick={() => setView('Home')} className="flex flex-col h-auto">
            <DriveWiseIcon className="h-6 w-6" />
            <span>Principal</span>
          </Button>
          <Button variant={view === 'Settings' ? "secondary" : "ghost"} onClick={() => setView('Settings')} className="flex flex-col h-auto">
            <SettingsIcon />
            <span>Configurações</span>
          </Button>
          <Button variant={view === 'History' ? "secondary" : "ghost"} onClick={() => setView('History')} className="flex flex-col h-auto">
            <HistoryIcon />
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




