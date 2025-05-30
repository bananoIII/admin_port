'use client'
// import node module libraries
import { Col, Row, Form, Card, Button, Image } from 'react-bootstrap';

// import widget as custom components
import { FormSelect, DropFiles } from 'widgets';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
// import hooks
import useMounted from 'hooks/useMounted';
import { useUser  } from 'context/userContext';

const GeneralSetting = () => {
  const hasMounted = useMounted();

  const { usuario } = useUser();
  const router = useRouter()

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/get_session`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/authentication/sign-in');
          return;
        }

        const data = await res.json();
        if (!data.usuario) {
          router.push('/authentication/sign-in');
          return;
        }

        // Guardar el usuario en estado si lo necesitas en el componente
        setUsuario(data.usuario);
      } catch (err) {
        
      }
    };

      verificarSesion();
  }, [router]);

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Configuracion general</h4>
          <p className="mb-0 fs-5 text-muted">Perfil </p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card>
          {/* card body */}
          <Card.Body>
            <div className=" mb-6">
              <h4 className="mb-1">Configuracion general</h4>
            </div>
            <div>
              <div className="mb-6">
                <h4 className="mb-1">Informacion básica</h4>
              </div>
              {hasMounted && 
                <Form>
                {/* Nombre completo */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="fullName">Nombre completo</Form.Label>
                  <Col sm={4} className="mb-3 mb-lg-0">
                    <Form.Control
                      type="text"
                      id="fullName"
                      value={usuario?.firstName || ''}
                      readOnly
                    />
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      id="lastName"
                      value={usuario?.lastName || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* Correo institucional */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="email">Correo electrónico</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="email"
                      id="email"
                      value={usuario?.email || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* Correo personal */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="personalEmail">Correo personal</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="email"
                      id="personalEmail"
                      value={usuario?.personalEmail || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* Teléfono */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="phone">Teléfono</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="text"
                      id="phone"
                      value={usuario?.phone || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* Fecha de nacimiento */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="birthDate">Fecha de nacimiento</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="text"
                      id="birthDate"
                      value={(usuario?.birthDate) || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* Género */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="gender">Género</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="text"
                      id="gender"
                      value={usuario?.gender || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* RFC */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="rfc">RFC</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="text"
                      id="rfc"
                      value={usuario?.rfc || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
                {/* Role */}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4" htmlFor="role">Rol</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      type="text"
                      id="role"
                      value={usuario?.role || ''}
                      readOnly
                    />
                  </Col>
                </Row>
          
              </Form>
                
              }

              
            </div>
          </Card.Body>
        </Card>

      </Col>
    </Row>
  )
}



export default GeneralSetting