import express from "express"
import mysql from "mysql"
import cors from "cors"
import { v4 as uuidv4 } from 'uuid'

import admin from "firebase-admin"
// import credentials from './key/key.json'

const credentials = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN,
}

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore()

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended: true}))

/* get all data without pagination */
// app.get('/', async (req, res) => {
//     try {
//         const patientRef = db.collection("Patients").orderBy("PatientName")
//         const response = await patientRef.get()

//         let responseArr = [];

//         response.forEach(doc => {
//             const dataWithId = { PatientId: doc.id, ...doc.data() }
//             responseArr.push(dataWithId)
//         });

//         res.send(responseArr)
//     } catch(error) {
//         res.send(error)
//     }
// })

/* get all data with pagination */
app.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const sortBy = req.query.sort_by || 'PatientName'
        const sortOrder = req.query.sort_order || 'asc'

        const startAt = (page - 1) * limit;

        let patientRef = db.collection("Patients")

        patientRef = patientRef.orderBy(sortBy, sortOrder)

        patientRef = patientRef.limit(limit).offset(startAt)

        const response = await patientRef.get()

        const totalPatients = await db.collection("Patients").get()
        const total = totalPatients.docs.length

        const totalPages = Math.ceil(total / limit)

        const responseArr = []

        response.forEach(doc => {
            const dataWithId = { PatientId: doc.id, ...doc.data() }
            responseArr.push(dataWithId)
        });

        res.json({ patients: responseArr, total, totalPages })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
});



app.get('/read/:id', async (req, res) => {
    try {
        const patientRef = db.collection("Patients").doc(req.params.id)
        const response = await patientRef.get()

        const dataWithId = { PatientId: response.id, ...response.data()}

        res.send(dataWithId)
    } catch(error) {
        res.send(error)
    }
})

app.post('/patient',async (req, res) => {
    try {

        const patientId = uuidv4();
        const treatmentString = req.body.treatment.join(', ')
        const medicationString = req.body.medication.join(', ')
        const patientJson = {
            PatientName: req.body.name,
            DateOfTreatment: req.body.date,
            TreatmentDescription: treatmentString,
            MedicationsPrescribed: medicationString,
            CostOfTreatment: req.body.cost
        }
        const response = await db.collection("Patients").doc(patientId).set(patientJson)
        res.send(response)
    } catch(error) {
        res.send(error)
    }
})

app.put('/update/:id', async (req, res) => {
    try {

        const treatmentString = req.body.treatment.join(', ')
        const medicationString = req.body.medication.join(', ')
        const patientRef = await db.collection("Patients").doc(req.params.id)
        .update({
            PatientName: req.body.PatientName,
            DateOfTreatment: req.body.DateOfTreatment,
            TreatmentDescription: treatmentString,
            MedicationsPrescribed: medicationString,
            CostOfTreatment: req.body.CostOfTreatment
        })
        res.send(patientRef)
    } catch(error) {
        res.send(error)
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const response = await db.collection("Patients").doc(req.params.id).delete()
        res.send(response)
    } catch(error) {
        res.send(error)
    }
})

/* This is for MYSQL Database LOCAL only */
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'carenow'
// })

// app.get('/', (req, res) => {
//     const sql = "SELECT * FROM Patients";
//     db.query(sql, (err, result) => {
//         if(err) return res.json({Message : "Error inside server"});
//         return res.json(result)
//     })
// })

// app.get('/read/:id', (req, res) => {
//     const sql = "SELECT * FROM Patients WHERE PatientId = ?";
//     const id = req.params.id

//     db.query(sql,[id], (err, result) => {
//         if(err) return res.json({Message : "Error inside server"});
//         return res.json(result)
//     })
// })

// app.delete('delete/:id', (req, res) => {
//     const sql = "DELETE FROM Patients WHERE PatientId = ?"
//     const id = req.params.id

//     db.query(sql,[id], (err, result) => {
//         if(err) return res.json({Message : "Error inside server"});
//         return res.json(result)
//     })
// })

// app.post('/patient', (req, res) => {
//     const patientId = uuidv4();

//     const treatmentString = req.body.treatment.join(', ');
//     const medicationString = req.body.medication.join(', ');

//     const sql = "INSERT INTO Patients (`PatientName`, `PatientId`, `DateOfTreatment`, `TreatmentDescription`, `MedicationsPrescribed`, `CostOfTreatment`) VALUES (?)";
//     const values = [
//         req.body.name,
//         patientId,
//         req.body.date,
//         treatmentString,
//         medicationString,
//         req.body.cost
//     ]
//     db.query(sql, [values], (err, result) => {
//         if(err) return res.json(err);
//         return res.json(result);
//     })
// })

app.listen(8081, ()=> {
    console.log("Listening... 8081")
})

