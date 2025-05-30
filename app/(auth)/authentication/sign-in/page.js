'use client'

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';


// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

// import hooks
import useMounted from 'hooks/useMounted';

const SignIn = () => {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Correcto:

    

  const response = await fetch(`${API_URL}/login_admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Login exitoso: redirigir al panel de admin o guardar algo en el estado
      router.push('/admin');
    } else {
      // Mostrar error
      setErrorMessage(data.error || 'Login fallido');
    }
  };

  

  const hasMounted = useMounted();
  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Image src="/images/brand/logo/logo-primary.svg" className="mb-2" alt="" />
              <p className="mb-6">Pro favor, ingresa tu información.  </p>
              <p style={{ color: 'red' }}>{errorMessage}</p>
            </div>
            {/* Form */}
            {hasMounted &&
              <Form onSubmit={handleSubmit}>  
                {/* email */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Ingresa tu correo aquí"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="**************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                </div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">Sign In</Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                    </div>
                  </div>
                </div>
              </Form>}


          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}


export default SignIn