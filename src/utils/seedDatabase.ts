
import { Firestore, collection, getDocs, addDoc } from 'firebase/firestore';

export const DEFAULT_CATEGORIES = [
    { name: 'Combustível' },
    { name: 'Alimentação' },
    { name: 'Manutenção' },
    { name: 'Aluguel do Carro' },
    { name: 'Limpeza' },
    { name: 'Seguro' },
    { name: 'Outros' }
];

export const DEFAULT_RIDE_APPS = [
    { name: 'Uber' },
    { name: '99' },
    { name: 'Indriver' },
    { name: 'Particular' }
];

export const seedDatabase = async (firestore: Firestore) => {
    try {
        // Check if categories exist
        const catRef = collection(firestore, 'categories');
        const catSnapshot = await getDocs(catRef);

        if (catSnapshot.empty) {
            console.log('Seeding categories...');
            for (const cat of DEFAULT_CATEGORIES) {
                await addDoc(catRef, cat);
            }
            console.log('Categories seeded!');
        }

        // Check if rideApps exist
        const appRef = collection(firestore, 'rideApps');
        const appSnapshot = await getDocs(appRef);

        if (appSnapshot.empty) {
            console.log('Seeding ride apps...');
            for (const app of DEFAULT_RIDE_APPS) {
                await addDoc(appRef, app);
            }
            console.log('Ride apps seeded!');
        }

        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
};
