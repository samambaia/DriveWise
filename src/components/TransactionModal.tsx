'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, collection, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  type: z.enum(['Revenue', 'Expense']),
  amount: z.number().positive('Amount must be positive.'),
  categoryOrAppId: z.string().min(1, 'Please select a category or app.'),
  description: z.string().optional(),
  tripCount: z.number().int().positive().optional(),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any | null;
  periodId: string;
  userId: string;
  categories: any[];
  rideApps: any[];
  defaultType?: 'Revenue' | 'Expense' | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  transaction,
  periodId,
  userId,
  categories,
  rideApps,
  defaultType,
}: TransactionModalProps) {
  const { firestore } = useFirebase();
  const isEditMode = !!transaction;
  const { toast } = useToast();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType || transaction?.type || 'Revenue',
      amount: transaction?.amount || undefined,
      categoryOrAppId: transaction?.categoryOrAppId || '',
      description: transaction?.description || '',
      tripCount: transaction?.tripCount || 1,
    },
  });

  const transactionType = form.watch('type');

  useEffect(() => {
    form.reset({
      type: defaultType || transaction?.type || 'Revenue',
      amount: transaction?.amount || undefined,
      categoryOrAppId: transaction?.categoryOrAppId || '',
      description: isEditMode 
        ? transaction?.description 
        : (defaultType === 'Revenue' ? (rideApps.find(app => app.id === form.getValues('categoryOrAppId'))?.name || 'Ride') : ''),
      tripCount: transaction?.tripCount || 1,
    });
  }, [isOpen, transaction, defaultType, form, rideApps, isEditMode]);
  

  const onSubmit = async (data: TransactionFormValues) => {
    if (!firestore || !userId || !periodId) {
      console.error('Firestore, userId, or periodId not available.');
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a transação. Tente novamente.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const docData: any = {
        type: data.type,
        amount: data.amount,
        categoryOrAppId: data.categoryOrAppId,
        periodId: periodId,
        timestamp: isEditMode ? transaction.timestamp : serverTimestamp(),
      };

      if (data.type === 'Revenue') {
        docData.tripCount = data.tripCount || 1;
        docData.description = rideApps.find(app => app.id === data.categoryOrAppId)?.name || 'Ride';
      } else {
        docData.description = data.description || '';
      }

      if (isEditMode) {
        const transactionRef = doc(firestore, `users/${userId}/periods/${periodId}/transactions`, transaction.id);
        await updateDoc(transactionRef, docData);
        toast({ title: 'Transação Atualizada', description: 'Suas alterações foram salvas.' });
      } else {
        const newTransactionRef = doc(collection(firestore, `users/${userId}/periods/${periodId}/transactions`));
        docData.id = newTransactionRef.id;
        await setDoc(newTransactionRef, docData);
        toast({ title: 'Transação Salva', description: 'Sua nova transação foi registrada.' });
      }

      onClose();
    } catch (e) {
      console.error('Failed to save transaction:', e);
      toast({
        title: 'Erro ao Salvar',
        description: 'Ocorreu um erro. Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Atualize os detalhes da transação.' : 'Adicione uma nova Corrida ou Despesa.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                      disabled={isEditMode}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Revenue" />
                        </FormControl>
                        <FormLabel className="font-normal">Corrida</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Despesa</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value || 0}
                      onValueChange={(value) => field.onChange(value)}
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryOrAppId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{transactionType === 'Revenue' ? 'App Corrida' : 'Categoria'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${transactionType === 'Revenue' ? 'um aplicativo' : 'uma categoria'}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(transactionType === 'Revenue' ? rideApps : categories).map((item: any) => (
                        <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {transactionType === 'Expense' && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.:, Combustível, almoço" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {transactionType === 'Revenue' && (
               <FormField
                control={form.control}
                name="tripCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantas Corridas</FormLabel>
                    <FormControl>
                       <Input
                         type="number"
                         {...field}
                         value={field.value ?? ''}
                         onChange={(e) => {
                           const value = e.target.value;
                           // Allow the field to be empty, otherwise parse as an integer.
                           // `undefined` is used for an empty field to work with the optional schema.
                           field.onChange(value === '' ? undefined : parseInt(value, 10));
                         }}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
