import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Create() {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    date: '',
    treatment: [],
    medication: [],
    cost: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z\s]*$/, 'Name should contain only alphabets and spaces').required('Name is required'),
    cost: Yup.number().typeError('Cost must be a number').required('Cost is required'),
    treatment: Yup.array().min(1, 'At least one option must be selected for Treatment Description'),
    medication: Yup.array().min(1, 'At least one option must be selected for Medications Prescribed')
  });

  const handleSubmit = (values, { setFieldTouched }) => {
    setFieldTouched('treatment', true);
    setFieldTouched('medication', true);
  
    // Accessing errors directly from Formik's context
    const errors = Formik.errors;
  
    if (Object.keys(errors).length === 0) {
      axios.post('http://localhost:8081/patient', values)
        .then(res => {
          console.log(res);
          navigate('/');
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Add Patient</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className='mb-2'>
                <label htmlFor='name'>Name</label>
                <Field
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Patient Name'
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name='name' component='div' className='invalid-feedback' />
              </div>
              <div className='mb-2'>
                <label htmlFor='date'>Date Of Treatment</label>
                <Field
                  type='date'
                  id='date'
                  name='date'
                  className='form-control'
                  required
                />
              </div>
              <div className='mb-2'>
                <label>Treatment Description</label>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='treatmentInfluenza'
                      name='treatment'
                      value='Influenza'
                    />
                    Influenza
                  </label>
                </div>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='treatmentFever'
                      name='treatment'
                      value='Fever'
                    />
                    Fever
                  </label>
                </div>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='treatmentVomit'
                      name='treatment'
                      value='Vomit'
                    />
                    Vomit
                  </label>
                </div>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='treatmentRash'
                      name='treatment'
                      value='Rash'
                    />
                    Rash
                  </label>
                </div>
                <ErrorMessage name='treatment' component='div' className='invalid-feedback' />
              </div>
              <div className='mb-2'>
                <label>Medications Prescribed</label>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='medicationAcetaminophen'
                      name='medication'
                      value='Acetaminophen'
                    />
                    Acetaminophen
                  </label>
                </div>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='medicationColchicine'
                      name='medication'
                      value='Colchicine'
                    />
                    Colchicine
                  </label>
                </div>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='medicationOmeprazole'
                      name='medication'
                      value='Omeprazole'
                    />
                    Omeprazole
                  </label>
                </div>
                <div>
                  <label>
                    <Field
                      type='checkbox'
                      id='medicationHydrocortisone'
                      name='medication'
                      value='Hydrocortisone'
                    />
                    Hydrocortisone
                  </label>
                </div>
                <ErrorMessage name='medication' component='div' className='invalid-feedback' />
              </div>
              <div className='mb-2'>
                <label htmlFor='cost'>Cost of Treatment</label>
                <Field
                  type='number'
                  id='cost'
                  name='cost'
                  className={`form-control ${errors.cost && touched.cost ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name='cost' component='div' className='invalid-feedback' />
              </div>
              <button type='submit' className='btn btn-success' style={{ marginRight: '10px' }}>
                Submit
              </button>
              <Link to="/" className='btn btn-danger'>Cancel</Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Create;