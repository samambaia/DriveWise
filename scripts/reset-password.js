
const admin = require('firebase-admin');

// 1. Initialize Firebase Admin
// We rely on Google Application Default Credentials (ADC) being set up.
// If this fails, the user needs to set GOOGLE_APPLICATION_CREDENTIALS.
try {
    admin.initializeApp({
        projectId: 'studio-8451728536-d17e8'
    });
} catch (e) {
    console.error("Initialization error:", e.message);
}

async function resetPassword() {
    const uid = 'h6wiTamzkcWyTDoqKb547UfSL763'; // The User ID for samambaia.jr@outlook.com
    const newPassword = 'password123';

    console.log(`Attempting to reset password for user ${uid}...`);

    try {
        const userRecord = await admin.auth().updateUser(uid, {
            password: newPassword,
        });
        console.log('Successfully updated user:', userRecord.toJSON());
        console.log('--------------------------------------------------');
        console.log('NEW PASSWORD: ' + newPassword);
        console.log('--------------------------------------------------');
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 'app/invalid-credential') {
            console.log("\n--- CREDENTIAL ERROR ---");
            console.log("To run this admin script, you need a Service Account Key.");
            console.log("Using the local 'firebase login' is not enough for the Admin SDK.");
        }
    }
}

resetPassword();
