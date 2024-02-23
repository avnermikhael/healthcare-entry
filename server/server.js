import express from "express"
import mysql from "mysql"
import cors from "cors"
import { v4 as uuidv4 } from 'uuid'

import admin from "firebase-admin"
// import credentials from './key/key.json'

const credentials = {
    "type": "service_account",
    "project_id": "fir-carenow",
    "private_key_id": "b2fb54a11e86f37b8b1d41eb5db99a3705e70dd6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDD/5xGHa/Nlf88\nEh0Mv4/kST8vjOOE0vQXVzTVAqQbQ8S38L1P4dRXPaWl+IuZBISIS40JZ/SoK40P\nTEt7cFKwQmc6BN4JKarRGeZGmsVw9l+huzhzXFpS3MM1vzS0lQ56XL+oJiUFTF6V\nY6YK3QEFzxp6a//KTlykXkNdHJvrjwMUFjumplIR/7zIxX0S+9EB+UEqkgX4qi8e\n4rRmWyDQ+F8iDo10vS+23ehUP2s9tRlCmkaDkeCOQ9TSF8BhcyZ57OB/IvnuUPHh\n0HmiRJiLP+Qrke8GdAKO+I4EPbZVqToKoRecbH80Ufqyf/Kmtr+xNqwtuX9wFQzG\nGjuFPUOtAgMBAAECggEAUqRpTtE+qwd3pusWT6VINWBDIbgcyQkv/dV6A+UIsCxb\nepmqIVAd+ikWuww5RGx4u4Vrsw8fxHcUk+I+I47BduuQ3hBmVOO6UE/E3nltDgv8\nV9P64f2LYkwOjY+RWCFPiP2pnGt1Ca5hZUkunn8AauQgDIWURcfT3USXz997yQ73\nHvrrK47GeK7JwEWGvzUfn5fxXDkImuulFNhFhi272DWJRZl7IZfzmqkALMleFiOB\nhcYBtpvxXu9fH16UcLbkCtq7+bP1d1/nQKA5iY3oqhlk6qNr5zl7kz+qVMYwNLU4\nvNdbIcZ/WQSYZc01YFbYPEaIh1GjbU7Ltf63FU0iewKBgQDy4QMP5h+eEk036KOs\nRxVWwab4XUAi8ai+/xETlrayRqVeZa6ikv+UvQpGLU52E/yq0SPDrl8oJErjPNa9\nzcGeWaupw3kDzjaWnxpl3Qyx9NjMsx1nuvQ7nbxfWXbnHuVkiqYU9ikCz5F0tz3i\n1OHCfbEPtTLGtNBrB32u8LZ5JwKBgQDOlj803RCXCPH12KO1J6KCHn4tnpx1vl40\nRzdEGdTkZiKTKvjVYjuyjCJJjCRevJ7l5GSv4OWy3Hq0pWPhyKrSd+B4XrL4HmUa\nU/+QNnMVIC/4VDJqK/vQ9ZZFPVug3wLkBVYslRBHARpkBlnRZvflRCvzRIekH71x\n66ZToizZCwKBgQCyKVCftwT2ZSJzopl9ZF9I1qDuiyji+TX5dQ1Hu0SlHaFsz1X9\nN6t3pfwFYnKttxefDe8YOa7fuU+dxSEY9ffTep+r1hHNMtVkQ62Pj0kiuSLXdYRa\ndQ93M8vcfbn06/sFd5dAxRlsUGq4nTouTE6W5rCdfyOSE0zXVhVh4H1Z/QKBgQCe\n71CpZvoAeM1OCuHH2TpZSQRiLIjKvS7UoYWPSyBSp5EqEAFoiS7MaqtmUf8ZM5w7\n2b7s4OVW+fEdUbDKYAur6LY1ZQXjhd7apo0TchCPzDeboYs3y6bsWETH+DCqT2h1\n7PUjT3s6ZUrccVZgmAtXw17cxXhleFXTcyx/Y2GFiQKBgQDdFFHF5tG2ejHXlg4G\nq/otaAlNzCr5a7UMDty1B6o7Ip4yoXGiLNdsOHVZcZ23WTejcg7tdRrx0PaCu7SG\n0REmxLKOwqXcugQ229ggBYGrRy/xA60aZzGXeWam+AAdv/5DU6ifGcKMibBlC+BV\nQg1KAuoFoNR+B5aNTd/+3JCwdQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vz9fj@fir-carenow.iam.gserviceaccount.com",
    "client_id": "109021894911115286495",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vz9fj%40fir-carenow.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore()

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
    try {
        const patientRef = db.collection("Patients").orderBy("PatientName")
        const response = await patientRef.get()

        let responseArr = [];

        response.forEach(doc => {
            const dataWithId = { PatientId: doc.id, ...doc.data() }
            responseArr.push(dataWithId)
        });

        res.send(responseArr)
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

